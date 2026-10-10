# 内容添加与更新

网站收录真实提供的论文和学习资料。没有收到的论文、团队信息和英语语料不会被编造为正式记录。以后提供原始 PDF、学习笔记以及英语资料，即可沿用这里的结构持续整理。

## 科研目录

目录沿用提供的文件夹结构，大小写统一为 PACT、PAM、PAME；PAME 的含义没有自行扩展。

| 分类键 `category` | 展示目录 | 页面 |
| --- | --- | --- |
| `laser-diode-driver` | PAM 系统构建 → 激光二极管驱动 | `/photoacoustic/pam-system/laser-diode-driver/` |
| `system-building` | PAM 系统构建 → 系统搭建 | `/photoacoustic/pam-system/system-building/` |
| `pact` | 光声基础学习类文章 → PACT | `/photoacoustic/fundamentals/pact/` |
| `pam` | 光声基础学习类文章 → PAM | `/photoacoustic/fundamentals/pam/` |
| `pame` | 光声基础学习类文章 → PAME | `/photoacoustic/fundamentals/pame/` |

每篇真实论文建立一个 `src/content/papers/<slug>.md`。`slug` 使用小写英文、数字和连字符；同一分类下不能重复。页面自动生成于该分类下，形式是 `/photoacoustic/<专题>/<分类>/<slug>/`。

原始文件可以放在 `public/library/<slug>/`，例如原始 PDF、Markdown/Word/PDF 学习笔记和论文图。此目录部署后可跨设备下载；路径省略 `public` 前缀。允许使用已授权的 HTTPS 文件地址。缺少文件时省略相应字段，页面不会生成不存在的下载链接。

### 论文文件结构

以下是**字段模板**，只用于说明结构，不是论文示例，也没有进入网站。用真实资料替换占位内容之后才能发表。

```yaml
---
slug: replace-with-real-paper-slug
title: "填写论文的原始标题"
category: pam
status: draft
summary: "用短段落说明本篇研究的对象、问题与结果，依据原论文和学习笔记。"
journal: "填写核实后的期刊全名"
year: 2026 # 替换为实际发表年份
authors:
  - "填写真实作者，按论文顺序"
# doi: "填写真实 DOI，不带 https://doi.org/ 前缀"
tags: []
# updated: "2026-10-09" # 替换为实际整理日期，使用 YYYY-MM-DD
downloads: {}
# 收到文件后取消下面的注释，且先确认文件真实存在。
# downloads:
#   pdf:
#     url: /library/replace-with-real-paper-slug/original.pdf
#     label: original.pdf
#     size: "文件的实际大小，可省略"
#   notes:
#     url: /library/replace-with-real-paper-slug/learning-notes.md
#     label: learning-notes.md

# 团队信息需要查阅团队官网、作者所属机构或有出处的工作介绍。
# team:
#   name: "真实团队名称"
#   institution: "实际所属机构，可省略"
#   mainWork:
#     - "经来源核实的主要研究方向。与本篇论文的联系应说明清楚。"
#   sources:
#     - title: "团队官网或机构页面标题"
#       url: "真实 HTTPS 来源地址"

problem: "先进入研究场景：已有条件、想得到的结果、原方法的障碍及其后果。"
materials:
  - title: "原材料或研究对象"
    text: "依据论文交代材料、器件、样本或模型。在理论论文中可说明研究对象。"
    figureIds: []
methods:
  - title: "研究方法"
    text: "从任务出发说明具体处理步骤，并解释该步骤在真实实验或程序中对应什么。"
    figureIds: []
innovations:
  - title: "简洁的创新点标题"
    before: "论文所比较的原方法及其具体限制。"
    change: "作者改变了哪个模块、材料、流程或方法。"
    why: "为什么这个变化能解决前面的困难。新术语在此解释。"
    evidence: "明确比较对象、条件、指标及原论文中的结果出处。"
    tradeoff: "从论文依据说明代价与适用边界；不能只列优点。"
    figureIds: [] # 关联下方真实图的 id，图片会直接出现在创新点解释旁
results:
  - title: "主要结果"
    text: "保留文中可核实的结果与实验条件，区分论文结果和学习者的理解。"
    figureIds: []
conclusions:
  - "作者结论及对当前研究的实际意义。"
figures: []
# 收到原图并核实图注后填入：
# figures:
#   - id: figure-1
#     src: /library/replace-with-real-paper-slug/figure-1.png
#     alt: "准确描述图中模块、过程或比较的替代文本"
#     caption: "解释应该怎样读这张图、图中箭头与各模块意味着什么"
#     attribution: "真实第一作者，年份，期刊，Fig. 1；裁剪时标明面板编号"
#     source: "真实 HTTPS 原文来源地址，可省略"
references: []
# references:
#   - title: "原文或补充资料的真实标题"
#     url: "真实 HTTPS 地址"
---

## 学习解读的某个问题

从具体场景开始说明。这里写正文，并明确区分作者报告的结果和自己的推演。

- 在实验中对应哪个步骤。
- 这一步省略会造成什么结果。
```

`status: draft` 不生成公开详情页，也不计入目录与检索；设置为 `published` 才展示。公开前需提供研究问题、已核实团队及其来源、原始 PDF 与笔记下载入口，并填写材料/研究对象、方法、创新点、结果、结论和至少一张真实图。字段缺失会让构建给出明确错误。图的 `id` 必须唯一，所有 `figureIds` 必须引用已定义的图。站内下载文件及图片若不存在，构建也会明确报错；外部 HTTPS 链接需在发布预览时检查实际可用性。

标题、作者、期刊、年份和 DOI 按原论文核实。团队主要工作应查阅可靠的一手来源并附链接，不能仅凭论文作者名单推断团队方向。图使用原论文中的关键图片，保留图号、面板、出处；裁剪、标注或局部放大时不得改变科学含义。公开前还需确认下载文件及图片可以公开展示。

所有来自 PDF 和笔记的表述都应有对应依据。讲述顺序采用“研究场景 → 原方法的困难 → 作者采取的步骤 → 为什么有效 → 比较证据 → 代价与边界”。复杂新术语应先解释再使用；不能把二手摘要写成全文精读结论。

### 网页汇报模式

论文可增加可选的 `presentation` 字段，复用相同的分类、来源文件和图库。`presentation.title` 是页面短标题，`presentation.slides` 按汇报顺序列出各屏内容。已有的 `wang-2003-pat.md` 是真实论文实例。

每屏必填 `id`、`section`、`title` 和 `sourceNote`。`layout` 可选 `cover`、`split`、`wide`、`text`、`references`。正文使用 `lead`、`paragraphs`、`points`（label/text）、`metrics`（value/label）、`flow`（label/text）、`relation` 和 `takeaway`；图片通过 `figureIds` 关联现有图库，`sources` 为机构或原文链接。`sourcePage` 可将脚注链接到原文 PDF 的对应页。图库可提供 `width` 和 `height`，防止加载时版面跳动。

汇报页提供翻页、键盘导航、目录选择、全文阅读与全屏模式。未启用 JavaScript 时，所有屏幕仍可按顺序阅读，源文件链接照常可用。浏览器打印时显示全部页面。所有内容继续按转义文本输出，不允许将 HTML 或脚本写入数据字段；图的引用和幻灯片 ID 会在构建时验证。

后续论文可以只改内容文件和图片，不需要复制页面组件。报告使用英文；源 PDF 保持提交时的内容和语言。原始下载文件与提供的文件应核对 SHA-256，以验证未经修改。

### 正文格式与安全边界

Markdown 正文支持空行分隔的段落、独立标题行、连续无序/有序列表和引用。正文按转义文本渲染，**不执行 HTML、脚本、iframe 或 MDX**。图片与可点击外链放在上面的结构化字段中；行内 Markdown 强调、表格、链接和数学公式不会被解析。需要复杂科研公式时，后续另行确定数学显示方案；当前不要将未渲染的公式当作完整展示。

图示、下载 URL 只能使用站内绝对文件路径或 HTTPS；引用和团队来源只能使用 HTTPS。拒绝 `javascript:`、`data:`、协议相对地址、嵌入账号密码和路径穿越。建议文件名采用简单英文、数字与连字符，以便链接稳定。

## 英语资料

每条口语语料或单词建立一个 `src/content/english/<slug>.md`，详情页是 `/english/<slug>/`。分类与标签根据提供的真实资料填写，不预设学习者的使用场景。口语资料使用 `speaking`，单词使用 `vocabulary`。所有英语资料的 `slug` 不能重复。

下面同样只是**字段模板**，不作为实际语料发布：

```yaml
---
slug: replace-with-real-entry-slug
type: speaking # 或 vocabulary
status: draft
title: "填写真实英文表达或单词"
meaning: "对应的中文释义"
category: "按实际资料填写分类"
tags: []
# pronunciation: "已有的发音信息，可省略"
# context: "实际适用场景，可省略"
examples: []
# examples:
#   - english: "填写真实英文例句"
#     chinese: "对应中文，可省略"
sources: []
# sources:
#   - title: "来源标题"
#     url: "真实 HTTPS 来源地址"
# updated: "2026-10-09" # 替换为实际整理日期
---

## 学习笔记

补充用法、自己的理解或容易混淆的地方。
```

列表自动统计真实记录数；搜索支持英文、中文释义、标签、使用场景和例句，并可按口语/单词及资料分类筛选。详情显示释义、场景、例句、个人笔记与来源。当前版本没有跟读、音频录制或复习测试。

## 维护流程

1. 提供要整理的原始论文 PDF、对应学习笔记及期望分类；英语资料可按原文本提供。
2. 基于原始资料逐段整理，核实作者、期刊、年份、DOI、团队来源与关键图；未核实处保留为草稿。
3. 保存原始文件和结构化 Markdown，确认下载文件真实存在，图注及来源完整。
4. 核实完整后将该条记录设为 `published`，执行 `npm run build`；该命令检查字段、类型并生成页面。
5. 预览详情、检索、分类、原始文件下载及手机排版。正常后按项目已有的 GitHub → Vercel 流程更新。

当前以版本库中的内容文件持续维护，没有额外的在线资料上传或管理员后台。所有发布内容均公开阅读；是否加入在线编辑功能应单独确认。
