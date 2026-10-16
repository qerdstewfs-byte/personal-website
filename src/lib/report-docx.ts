import { strToU8, zipSync, type Zippable } from 'fflate';
import template from '../data/report-template.json' with { type: 'json' };
import { linkSegments, validateReportContent, type ReportBlock, type ReportContent } from './reports.ts';

export type ReportExportImage = { bytes: Uint8Array; mime: string; width: number; height: number };

const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
// Original A4 printable area, in English Metric Units. Leave room for a caption.
const MAX_IMAGE_WIDTH = 8306 * 635;
const MAX_IMAGE_HEIGHT = (16838 - 2880 - 1800) * 635;

function xml(value: string): string {
  return value.toWellFormed().replace(/[\uFFFE\uFFFF]/g, '\uFFFD').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function textNode(value: string): string {
  return value.split(/(\n|\t)/).map(part => part === '\n' ? '<w:br/>' : part === '\t' ? '<w:tab/>' : `<w:t xml:space="preserve">${xml(part)}</w:t>`).join('');
}

function dateLabel(date: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function imageExtension(image: ReportExportImage): 'png' | 'jpeg' {
  const bytes = image.bytes;
  const png = bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  const jpeg = bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if ((image.mime === 'image/png' && png) || (image.mime === 'image/jpeg' && jpeg)) {
    if (Number.isSafeInteger(image.width) && Number.isSafeInteger(image.height) && image.width > 0 && image.height > 0) {
      return image.mime === 'image/png' ? 'png' : 'jpeg';
    }
  }
  throw new Error('An image could not be exported. Reload it and try again.');
}

/**
 * Build one editable Word document from the content-free reference package.
 * Call only from the export action. No network calls, secrets or Node APIs are
 * used; every image is embedded, and the caller owns downloading the result.
 */
export async function buildWeeklyReportDocx(
  input: ReportContent,
  images: Map<string, ReportExportImage>,
): Promise<Uint8Array> {
  const content = validateReportContent(input);
  const files: Zippable = {};
  for (const [name, value] of Object.entries(template.parts)) files[name] = strToU8(value);
  const relationships: string[] = [];
  const listInstances: string[] = [];
  let nextListId = template.firstListNumberId;
  let nextRelationId = 1;
  let nextDrawingId = 1;
  const imageRelations = new Map<string, { id: string; image: ReportExportImage }>();
  const imageTypes = new Set<string>();

  function relation(type: string, target: string, external = false): string {
    const id = `rIdReport${nextRelationId++}`;
    relationships.push(`<Relationship Id="${id}" Type="${REL}/${type}" Target="${xml(target)}"${external ? ' TargetMode="External"' : ''}/>`);
    return id;
  }

  function runs(text: string, properties: string): string {
    return linkSegments(text).map(segment => {
      if (!segment.url) return `<w:r>${properties}${textNode(segment.text)}</w:r>`;
      const id = relation('hyperlink', segment.url, true);
      const linkedProperties = properties.replace('</w:rPr>', '<w:color w:val="0000FF"/><w:u w:val="single"/></w:rPr>');
      return `<w:hyperlink r:id="${id}" w:history="1"><w:r>${linkedProperties}${textNode(segment.text)}</w:r></w:hyperlink>`;
    }).join('');
  }

  function paragraph(text: string, role: keyof typeof template.patterns = 'body', listId?: number): string {
    const pattern = template.patterns[role];
    const properties = listId === undefined ? pattern.paragraph : pattern.paragraph.replace('__NUM_ID__', String(listId));
    return `<w:p>${properties}${runs(text, pattern.run)}</w:p>`;
  }

  function picture(block: Extract<ReportBlock, { kind: 'image' }>): string {
    let embedded = imageRelations.get(block.imageId);
    if (!embedded) {
      const image = images.get(block.imageId);
      if (!image) throw new Error('An image is missing. Reload the report and try again.');
      const extension = imageExtension(image);
      const filename = `report-image-${imageRelations.size + 1}.${extension}`;
      // PNG/JPEG are already compressed; storing them avoids a large CPU spike.
      files[`word/media/${filename}`] = [image.bytes, { level: 0 }];
      const id = relation('image', `media/${filename}`);
      imageTypes.add(extension);
      embedded = { id, image };
      imageRelations.set(block.imageId, embedded);
    }
    const { image, id } = embedded;
    // 96 dpi at native size; shrink large images, never distort their ratio.
    const ratio = Math.min(1, MAX_IMAGE_WIDTH / (image.width * 9525), MAX_IMAGE_HEIGHT / (image.height * 9525));
    const width = Math.max(1, Math.round(image.width * 9525 * ratio));
    const height = Math.max(1, Math.round(image.height * 9525 * ratio));
    const drawingId = nextDrawingId++;
    const alt = xml(block.alt || block.caption || 'Report image');
    const properties = `<w:pPr>${block.caption ? '<w:keepNext/>' : ''}<w:spacing w:before="80" w:after="80" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr>`;
    const drawing = `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${width}" cy="${height}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${drawingId}" name="Report image ${drawingId}" descr="${alt}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="Report image ${drawingId}" descr="${alt}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    return `<w:p>${properties}${drawing}</w:p>${block.caption ? paragraph(block.caption) : ''}`;
  }

  function blocks(items: ReportBlock[]): string {
    if (!items.length) return paragraph('');
    return items.map(block => {
      if (block.kind === 'paragraph') return paragraph(block.text);
      if (block.kind === 'image') return picture(block);
      if (!block.items.length) return paragraph('');
      const listId = nextListId++;
      listInstances.push(`<w:num w:numId="${listId}"><w:abstractNumId w:val="${template.listAbstractNumberId}"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`);
      return block.items.map(item => paragraph(item, 'list', listId)).join('');
    }).join('');
  }

  const documentBody = [
    paragraph(content.title, 'title'),
    paragraph([content.author, dateLabel(content.date)].filter(Boolean).join('  '), 'metadata'),
    paragraph('现阶段工作主题', 'heading'), blocks(content.sections.topic),
    paragraph('本周工作总结及问题', 'heading'),
    paragraph('工作总结', 'subheading'), blocks(content.sections.summary),
    paragraph('遇到问题', 'subheading'), blocks(content.sections.issues),
    paragraph('下周工作计划', 'heading'), blocks(content.sections.plan),
    paragraph('讨论结果', 'heading'), blocks(content.sections.discussion),
  ].join('');
  files['word/document.xml'] = strToU8(template.documentOpen + documentBody + template.section + template.documentClose);
  files['word/_rels/document.xml.rels'] = strToU8(template.parts['word/_rels/document.xml.rels'].replace('</Relationships>', relationships.join('') + '</Relationships>'));
  files['word/numbering.xml'] = strToU8(template.parts['word/numbering.xml'].replace('</w:numbering>', listInstances.join('') + '</w:numbering>'));
  files['[Content_Types].xml'] = strToU8(template.parts['[Content_Types].xml'].replace('</Types>', [...imageTypes].map(extension => `<Default Extension="${extension}" ContentType="image/${extension}"/>`).join('') + '</Types>'));
  // Metadata comes only from this report, never from the reference document.
  files['docProps/core.xml'] = strToU8(`${XML_DECLARATION}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xml(content.title)}</dc:title><dc:creator>${xml(content.author)}</dc:creator></cp:coreProperties>`);
  files['docProps/app.xml'] = strToU8(`${XML_DECLARATION}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Weekly Reports</Application></Properties>`);
  return zipSync(files, { level: 6 });
}
