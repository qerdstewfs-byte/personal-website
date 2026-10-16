"""Create the content-free browser export template from the supplied Word reference.

Run with the bundled Python runtime. The source DOCX is opened read-only; its
body text and personal metadata are never copied into the generated asset.
"""
from argparse import ArgumentParser
from copy import deepcopy
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile
import json
import re
from lxml import etree

EXPECTED_SHA = '80638568d54030351818883cf947a4acc94467103a15a50dbd66e0b4848f31a6'
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}
PRESERVE = {'word/styles.xml', 'word/theme/theme1.xml', 'word/fontTable.xml',
            'word/webSettings.xml', 'word/footnotes.xml', 'word/endnotes.xml'}

def strip_revision(element):
    for node in element.iter():
        for key in list(node.attrib):
            if etree.QName(key).localname.startswith('rsid'):
                del node.attrib[key]
    return element

def compact_xml(element):
    # These fragments are inserted under the unchanged document root, which
    # already supplies all namespace declarations used by the reference.
    value = etree.tostring(strip_revision(deepcopy(element)), encoding='unicode')
    return re.sub(r' xmlns(?::[\w]+)?="[^"]*"', '', value)

def main():
    parser = ArgumentParser()
    parser.add_argument('reference', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--inventory', type=Path, required=True)
    args = parser.parse_args()
    original = args.reference.read_bytes()
    if sha256(original).hexdigest() != EXPECTED_SHA:
        raise ValueError('Reference changed; inspect and update the template contract first.')
    with ZipFile(args.reference) as archive:
        raw = {name: archive.read(name) for name in archive.namelist()}
    document = etree.fromstring(raw['word/document.xml'])
    body = document.find('w:body', NS)
    paragraphs = body.findall('w:p', NS)
    pattern = {}
    for role, index in [('title', 0), ('metadata', 1), ('heading', 2), ('subheading', 6), ('body', 20), ('list', 3)]:
        p = paragraphs[index]
        ppr = deepcopy(p.find('w:pPr', NS))
        rpr = p.find('w:r/w:rPr', NS)
        if role == 'title':
            ppr.insert(0, etree.Element(f'{{{W}}}pStyle', {f'{{{W}}}val': 'a3'}))
            ppr.find('w:spacing', NS).set(f'{{{W}}}before', '0')
        if role in ('heading', 'subheading'):
            ppr.insert(1, etree.Element(f'{{{W}}}keepNext'))
            ppr.insert(2, etree.Element(f'{{{W}}}keepLines'))
        if role == 'body':
            ppr.insert(1, etree.Element(f'{{{W}}}widowControl'))
        if role == 'list':
            ppr.find('w:numPr/w:numId', NS).set(f'{{{W}}}val', '__NUM_ID__')
        run_xml = compact_xml(rpr)
        if role == 'title':
            # Explicit bold avoids Word's toggle interaction between the
            # existing Title paragraph style and the source 1Char run style.
            run_xml = run_xml.replace('</w:rPr>', '<w:b/><w:bCs/></w:rPr>')
        pattern[role] = {'paragraph': compact_xml(ppr), 'run': run_xml}
    section = compact_xml(body.find('w:sectPr', NS))
    document_text = raw['word/document.xml'].decode('utf-8')
    document_open = document_text.split('<w:body>', 1)[0] + '<w:body>'
    parts = {name: raw[name].decode('utf-8') for name in PRESERVE}
    parts['word/numbering.xml'] = raw['word/numbering.xml'].decode('utf-8')
    settings = etree.fromstring(raw['word/settings.xml'])
    for element in list(settings):
        if etree.QName(element).localname in ('rsids', 'docId'):
            settings.remove(element)
    parts['word/settings.xml'] = etree.tostring(settings, encoding='unicode')
    for name in ('_rels/.rels', 'word/_rels/document.xml.rels', '[Content_Types].xml'):
        root = etree.fromstring(raw[name])
        for element in list(root):
            if 'custom-properties' in element.get('Type', '') or element.get('PartName') == '/docProps/custom.xml' or element.get('Type', '').endswith('/hyperlink'):
                root.remove(element)
        parts[name] = etree.tostring(root, encoding='unicode')
    number_root = etree.fromstring(raw['word/numbering.xml'])
    next_num = 1 + max(int(n.get(f'{{{W}}}numId')) for n in number_root.findall('w:num', NS))
    result = {'sourceSha256': EXPECTED_SHA, 'parts': parts, 'patterns': pattern,
              'documentOpen': document_open, 'section': section,
              'documentClose': '</w:body></w:document>', 'firstListNumberId': next_num,
              'listAbstractNumberId': 1}
    asset = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    # Check every source text node, except reusable section headings. The
    # remaining short fragments include ordinary font/style labels and cannot
    # identify report content, so check substantive body fragments and names.
    forbidden = ['贺礼', '医学影像系统与应用实验室', '2026年10月15日',
                 '10.1002/lpor.202000484', '10.1038/s44303-026-00191-6', 'GrammarlyDocumentId', 'lenovo']
    for paragraph in paragraphs:
        for value in paragraph.xpath('.//w:t/text()', namespaces=NS):
            if len(value.strip()) >= 15:
                forbidden.append(value.strip())
    for value in forbidden:
        if value in asset:
            raise ValueError(f'Source content escaped sanitization: {value[:15]}')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(asset, encoding='utf-8')
    inventory = [{'path': name, 'bytes': len(value), 'sha256': sha256(value).hexdigest(),
                  'role': 'preserve' if name in PRESERVE else 'remove' if name == 'docProps/custom.xml' else 'editable'}
                 for name, value in raw.items()]
    args.inventory.parent.mkdir(parents=True, exist_ok=True)
    args.inventory.write_text(json.dumps(inventory, indent=2) + '\n', encoding='utf-8')
    assert args.reference.read_bytes() == original
    print('Extracted content-free reference patterns; original SHA-256 unchanged.')

if __name__ == '__main__':
    main()
