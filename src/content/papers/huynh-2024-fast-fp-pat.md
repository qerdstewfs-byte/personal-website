---
{
  "slug": "huynh-2024-fast-fp-pat",
  "title": "A fast all-optical 3D photoacoustic scanner for clinical vascular imaging",
  "category": "pact",
  "status": "published",
  "summary": "以 16/64 束并行 Fabry–Perot 光学读出、高重复频率激发和欠采样缩短三维血管成像时间，并通过人体结构、动态响应及探索性临床实验检验实用性。2024 年在线发表，正式卷期为 2025 年。",
  "journal": "Nature Biomedical Engineering",
  "year": 2025,
  "authors": [
    "N. T. Huynh",
    "E. Zhang",
    "O. Francies",
    "F. Kuklis",
    "T. Allen",
    "J. Zhu",
    "O. Abeyakoon",
    "F. Lucka",
    "M. Betcke",
    "J. Jaros",
    "S. Arridge",
    "B. Cox",
    "A. A. Plumb",
    "P. Beard"
  ],
  "doi": "10.1038/s41551-024-01247-x",
  "tags": [
    "Fabry–Perot",
    "Parallel readout",
    "Clinical vascular imaging",
    "Compressed sensing",
    "学习笔记"
  ],
  "updated": "2026-10-13",
  "downloads": {
    "pdf": {
      "url": "/library/huynh-2024-fast-fp-pat/original.pdf",
      "label": "huynh-2024-fast-fp-pat-original.pdf",
      "size": "13.08 MB"
    },
    "notes": {
      "url": "/library/huynh-2024-fast-fp-pat/reading-notes.pdf",
      "label": "huynh-2024-fast-fp-pat-reading-notes.pdf",
      "size": "13.44 MB"
    }
  },
  "references": [
    {
      "title": "Huynh 等，Nature Biomedical Engineering 9, 638–655 (2025)；2024-09-30 在线发表。",
      "url": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "title": "UCL：Photoacoustic Imaging Group 的研究方向",
      "url": "https://www.ucl.ac.uk/engineering/steapp/collaborate/policy-impact-unit/current-projects-and-publications/photoacoustic-imaging"
    }
  ],
  "team": {
    "name": "UCL 光声成像团队与临床、计算合作团队",
    "institution": "伦敦大学学院、UCL Hospitals，以及布尔诺理工大学、CWI 等合作机构",
    "mainWork": [
      "N. T. Huynh 与 E. Zhang 为共同第一作者，P. Beard 为通讯作者；论文结合 UCL 的光学传感、系统工程、临床影像和计算团队。",
      "UCL 官方介绍的团队方向涵盖光声探测与激发器件、无创扫描仪、传播模型、重建及光谱方法。本篇把这些能力聚焦到快速人体三维血管成像。"
    ],
    "sources": [
      {
        "title": "Huynh 等，Nature Biomedical Engineering 9, 638–655 (2025)；2024-09-30 在线发表。",
        "url": "https://doi.org/10.1038/s41551-024-01247-x"
      },
      {
        "title": "UCL：Photoacoustic Imaging Group 的研究方向",
        "url": "https://www.ucl.ac.uk/engineering/steapp/collaborate/policy-impact-unit/current-projects-and-publications/photoacoustic-imaging"
      }
    ]
  },
  "problem": "已有 FP 扫描仪可以显示细致的三维微血管，但逐点读出往往需要数分钟。面对无法长时间静止、可能疼痛或虚弱的患者，长采集不仅不方便，还会把不同时刻的结构混合成运动伪影。研究者因此要在保留小接收区域、宽带和灵敏度的同时，把几万个位置的采集缩短到秒级，并明确更快采集对图像质量、视野和计算的代价。",
  "materials": [
    {
      "title": "透明平面 FP 薄膜与多束读出",
      "text": "宽场脉冲激发光穿过透明 FP 传感膜照亮皮肤下方组织。连续读出激光分成 16 或 64 路，64 路通常排成 4×16 光斑阵列；每条光路连接独立光电检测与采集通道。激发光生成超声，连续光读取薄膜的声压调制。",
      "figureIds": [
        "fig-1ab",
        "fig-1a"
      ]
    },
    {
      "title": "健康人体与探索性临床对象",
      "text": "人体结构实验包括手指、手掌、腕部、舌及甲床；动态实验观察动脉搏动、探头平移和袖带阻断后的再灌注。临床部分研究足背血管、炎症和关节变化，用于展示可行性，并非确立疾病诊断阈值。",
      "figureIds": [
        "fig-2",
        "fig-3",
        "fig-7"
      ]
    }
  ],
  "methods": [
    {
      "title": "并行测量后继续扫描",
      "text": "每次激发同时读取 64 个位置的完整时间波形，再移动整组光斑。64 路表示每次可并行接收的位置数，经过扫描后仍会形成数万个测点；并不表示只有 64 个像素，也不表示每次激发完成一幅完整三维图。",
      "figureIds": [
        "fig-1a"
      ]
    },
    {
      "title": "共同读出波长需要均匀薄膜",
      "text": "各束光共享读出波长，若不同位置的最佳偏置相差太大，部分通道会落在不敏感的曲线平坦区。作者用高均匀性聚合物膜控制偏置变化，并比较单束与 64 束读出的噪声等效压力分布，检查并行化是否明显损害灵敏度。",
      "figureIds": [
        "fig-1e"
      ]
    },
    {
      "title": "常规重建与欠采样重建分开",
      "text": "除图 5b 外，论文使用通过 k-Wave 实现的 k 空间反投影；图 5b 对欠采样数据使用带总变分正则化及非负约束的迭代模型重建。二维模式另有随深度变化的接收聚焦，抑制切面外信号。网页不把用于教学的逐点延迟求和等同于论文代码。",
      "figureIds": []
    },
    {
      "title": "采集、传输、计算和显示分别核算",
      "text": "常规 34,560 条波形在 6,400 条每秒时采集约 5.4 s。二维例子报告 33 帧每秒采集、另有在线 25 帧每秒；三维滑窗可更频繁更新图像，但相邻帧共享大部分数据。欠采样减少采集量，却可能把重建时间提高到约 25 min。",
      "figureIds": [
        "fig-5b",
        "fig-6a",
        "fig-6b"
      ]
    }
  ],
  "innovations": [
    {
      "title": "保持灵敏度的多束并行读出",
      "before": "早期单束 FP 系统按位置依次测量，数万个测点使人体扫描过慢。",
      "change": "将读出并行至 16/64 路，同时优化薄膜均匀性、光学扫描及多通道采集。",
      "why": "一次激发可并行记录多条波形；均匀膜层使共享读出波长的各通道保持较高灵敏度。",
      "evidence": "图 1e 比较单束和 64 束噪声等效压力分布；图 2 的 34,560 条波形在 5.4 s 内完成采集。",
      "tradeoff": "需精密膜层、光纤光路及多通道电子学；进一步增加通道仍受成本、复杂度和传输约束。",
      "figureIds": [
        "fig-1a",
        "fig-1e"
      ]
    },
    {
      "title": "提高激发频率与减少采样量",
      "before": "并行读出之后，激发重复率和总测点数继续限制速度。",
      "change": "使用更高重复率激光，并在另一条路径中随机欠采样后施加模型约束重建。",
      "why": "前者增加每秒采到的波形数，后者减少每幅图需要记录的波形数。",
      "evidence": "图 5a 的 1 kHz 激发示例采集约 0.3 s；图 5b 仅用 12.5% 数据，对应采集约 0.7 s。",
      "tradeoff": "更高频率下脉冲能量、波长和照明条件改变；欠采样图的对比噪声比从 36 dB 降至 25 dB，迭代重建可达约 25 min。",
      "figureIds": [
        "fig-5a",
        "fig-5b"
      ]
    },
    {
      "title": "从结构图进入动态与临床可行性",
      "before": "分钟级三维扫描难以反映快速生理变化，也难用于常规探头定位。",
      "change": "构建二维动态、三维滑窗与人体病例扫描模式。",
      "why": "较快采集减轻运动影响，并允许连续记录血管形态和相对光声信号的变化。",
      "evidence": "图 6 展示动脉搏动与再灌注；图 7、8 展示足背和炎症相关血管指标。",
      "tradeoff": "三维刷新率不等于独立体积率；病例证据仍属探索性，不能直接支持普遍诊断性能或绝对血流、血氧定量。",
      "figureIds": [
        "fig-6c",
        "fig-7",
        "fig-8a"
      ]
    }
  ],
  "results": [
    {
      "title": "空间性能随条件变化",
      "text": "在扫描中心，横向分辨率随 1–12 mm 深度约从 60 增至 120 μm；纵向约 45 μm。常规图 2 采集 5.4 s，高分辨率图 4 减小步距后采集 29 s。人体图像可见接近 15 mm 深处结构，但不同位置、模式与指标不可直接拼成统一最佳性能。",
      "figureIds": [
        "fig-1cd",
        "fig-2c",
        "fig-4"
      ]
    },
    {
      "title": "单次激发、无需信号平均",
      "text": "本文各项成像采用单次激发，不作信号平均。20 MHz 测量带宽下，多束扫描噪声等效压力分布众数约 0.2 kPa，单束约 0.25 kPa；分布相近支持多束方案可保持总体灵敏度，不表示所有位置完全一致。",
      "figureIds": [
        "fig-1e"
      ]
    },
    {
      "title": "动态测量的时间边界",
      "text": "二维离线例子的 30 ms 是一帧所需数据的扫描时间。三维 16.7 帧每秒来自 0.6 s 数据窗每次更新 10% 的滑窗，相邻帧并非全新独立体积。另有在线三维定位示例约 3 帧每秒。",
      "figureIds": [
        "fig-6a",
        "fig-6b"
      ]
    },
    {
      "title": "探索性临床结果",
      "text": "足背病例显示可辨的血管迂曲与形态差异；炎症随访显示可见血管密度变化。关节比较包含 7 名活动期患者的 17 个关节与 5 名健康志愿者的 44 个关节。作者明确这些研究不构成完整临床验证，图像指标也不等同于绝对生理量。",
      "figureIds": [
        "fig-7",
        "fig-8a"
      ]
    }
  ],
  "conclusions": [
    "本篇的主要工程进展是加快 FP 三维光声采集，使高质量人体血管图从分钟级推进到秒级。",
    "并行读出、高重复率激发和欠采样是不同的加速手段，分别付出通道复杂度、能量与照明限制、图像质量和计算成本。",
    "动态与病例结果支持技术和应用可行性；不能把滑窗刷新解释成独立体积率，也不能把探索性结果当成已验证的诊断工具。",
    "本地原文共 23 页、完整学习笔记 89 页均原样提供；笔记中的年份说明、原文差异和方法边界继续保留。"
  ],
  "figures": [
    {
      "id": "fig-1ab",
      "src": "/library/huynh-2024-fast-fp-pat/fig-1ab.webp",
      "width": 1578,
      "height": 738,
      "alt": "多束 FP 扫描的光路示意与仪器实物",
      "caption": "左侧是读出架构，右侧是系统实物；脉冲激发和连续读出使用不同光路。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 1a–b（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-1a",
      "src": "/library/huynh-2024-fast-fp-pat/fig-1a.webp",
      "width": 879,
      "height": 738,
      "alt": "64 路光纤、二维振镜与透明 FP 薄膜的系统示意",
      "caption": "每次激发并行读取 64 个位置，再扫描整组光斑，逐步覆盖二维接收面。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 1a（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-1cd",
      "src": "/library/huynh-2024-fast-fp-pat/fig-1cd.webp",
      "width": 1035,
      "height": 390,
      "alt": "传感器宽频响应与横向分辨率随位置的变化",
      "caption": "频率响应与位置标定回答不同问题；分辨率不是整幅视野内相同的最佳数字。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 1c–d（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-1e",
      "src": "/library/huynh-2024-fast-fp-pat/fig-1e.webp",
      "width": 543,
      "height": 390,
      "alt": "单束与 64 束读出的噪声等效压力分布直方图",
      "caption": "两组分布总体相近，支持并行读出保持灵敏度；不是逐点数值完全一致。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 1e（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-2",
      "src": "/library/huynh-2024-fast-fp-pat/fig-2.webp",
      "width": 1578,
      "height": 1473,
      "alt": "手指、手掌及腕部的三维血管投影与局部切面",
      "caption": "先按深度色标看三维层次，再用局部灰度图核对细结构。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 2（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-2a",
      "src": "/library/huynh-2024-fast-fp-pat/fig-2a.webp",
      "width": 681,
      "height": 690,
      "alt": "指尖血管投影与静脉瓣局部灰度图",
      "caption": "深度颜色表示位置；右侧放大图用于查看静脉瓣样结构。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 2a（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-2c",
      "src": "/library/huynh-2024-fast-fp-pat/fig-2c.webp",
      "width": 681,
      "height": 729,
      "alt": "手掌血管的深度编码投影及分层显示",
      "caption": "较深层结构与浅层网络属于不同深度，不能把投影中的交叉直接看作连通。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 2c（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-3",
      "src": "/library/huynh-2024-fast-fp-pat/fig-3.webp",
      "width": 1542,
      "height": 717,
      "alt": "舌背不同深度的血管构型与局部灰度图",
      "caption": "从表层乳头微血管读到深部供血结构，展示同一设备处理不同解剖部位。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 3（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-4",
      "src": "/library/huynh-2024-fast-fp-pat/fig-4.webp",
      "width": 1581,
      "height": 1368,
      "alt": "高分辨率模式下腕部与甲床的血管投影",
      "caption": "步距变细可以呈现更多细节，但这组数据采集 29 s；不与 5.4 s 模式混写。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 4（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-5a",
      "src": "/library/huynh-2024-fast-fp-pat/fig-5a.webp",
      "width": 1554,
      "height": 465,
      "alt": "100、200 和 1000 赫兹激发下的图像与采集时间",
      "caption": "比较时同时看扫描时间和图像对比；1 kHz 组使用不同激光条件。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 5a（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-5b",
      "src": "/library/huynh-2024-fast-fp-pat/fig-5b.webp",
      "width": 1551,
      "height": 627,
      "alt": "100%、50%、25% 与 12.5% 数据比例下的三维血管图",
      "caption": "减少测量会缩短采集并降低对比；这些图由迭代重建得到，计算时间另计。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 5b（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-6a",
      "src": "/library/huynh-2024-fast-fp-pat/fig-6a.webp",
      "width": 1404,
      "height": 537,
      "alt": "二维多排接收几何、扫描序列和桡动脉搏动",
      "caption": "示例 33 帧每秒首先描述采集速度；在线显示另报告 25 帧每秒。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 6a（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-6b",
      "src": "/library/huynh-2024-fast-fp-pat/fig-6b.webp",
      "width": 1404,
      "height": 345,
      "alt": "探头与指尖相对移动时的三维滑窗帧",
      "caption": "虚线跟踪血管分叉的位移；相邻图像共享大部分测量数据。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 6b（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-6c",
      "src": "/library/huynh-2024-fast-fp-pat/fig-6c.webp",
      "width": 1404,
      "height": 771,
      "alt": "袖带阻断与再灌注过程的图像和区域信号曲线",
      "caption": "血管区域随恢复灌注变亮，而表皮区域较稳定；曲线是归一化光声信号。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 6c（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-7",
      "src": "/library/huynh-2024-fast-fp-pat/fig-7.webp",
      "width": 1551,
      "height": 1368,
      "alt": "疑似外周血管病患者足背的图像与血管形态比较",
      "caption": "比较局部形态和曲折程度，用于探索性可行性评估，不能据图建立通用诊断阈值。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 7（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    },
    {
      "id": "fig-8a",
      "src": "/library/huynh-2024-fast-fp-pat/fig-8a.webp",
      "width": 1545,
      "height": 900,
      "alt": "皮肤炎症随访的血管图与骨架表示",
      "caption": "原始图和骨架用于估算可分辨血管密度；该指标仍受可见阈值与成像条件影响。",
      "attribution": "Huynh 等，2025，Nature Biomedical Engineering，图 8a（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41551-024-01247-x"
    }
  ],
  "presentation": {
    "title": "Huynh 等（2024 / 2025）文献汇报",
    "language": "zh-CN",
    "slides": [
      {
        "id": "overview",
        "section": "文献汇报 / HUYNH 等，2024 / 2025",
        "title": "快速全光学三维血管成像",
        "sourceNote": "原文第 1–5 页，图 2；正式卷期与在线年份见期刊来源。",
        "layout": "cover",
        "lead": "细致的 FP 三维血管图已经能获得。下一步，怎样把等待数分钟变成数秒，真正用于人体？",
        "figureIds": [
          "fig-2a"
        ],
        "metrics": [
          {
            "value": "5.4 s",
            "label": "图 2 常规三维采集"
          },
          {
            "value": "≈15 mm",
            "label": "人体可见结构的深度上限尺度"
          }
        ],
        "sourcePage": 4
      },
      {
        "id": "publication-team",
        "section": "期刊与研究团队",
        "title": "论文身份与年份",
        "sourceNote": "原文第 1 页；学习笔记第 6–7 页；正式期刊页面。",
        "layout": "text",
        "lead": "Nature Biomedical Engineering · 9: 638–655 (2025) · 2024 年 9 月 30 日首次在线发表",
        "points": [
          {
            "label": "共同第一作者与通讯作者",
            "text": "N. T. Huynh、E. Zhang 为共同第一作者；P. Beard 为通讯作者。"
          },
          {
            "label": "合作结构",
            "text": "UCL 的传感、系统与计算团队联合 UCL Hospitals 及其他计算机构开展人体研究。"
          },
          {
            "label": "年份说明",
            "text": "沿用 Zotero 文件的 2024 年标识，正式书目信息采用 2025 年卷期；两者指同一论文。"
          }
        ],
        "sources": [
          {
            "title": "Huynh 等，Nature Biomedical Engineering 9, 638–655 (2025)；2024-09-30 在线发表。",
            "url": "https://doi.org/10.1038/s41551-024-01247-x"
          },
          {
            "title": "UCL：Photoacoustic Imaging Group 的研究方向",
            "url": "https://www.ucl.ac.uk/engineering/steapp/collaborate/policy-impact-unit/current-projects-and-publications/photoacoustic-imaging"
          }
        ],
        "sourcePage": 1
      },
      {
        "id": "problem",
        "section": "研究场景",
        "title": "人体不能长时间静止",
        "sourceNote": "原文第 1–2 页；学习笔记第 7 页。",
        "layout": "text",
        "lead": "医生希望看到皮肤下微血管，但患者在呼吸、移动，有时还伴随疼痛。",
        "points": [
          {
            "label": "已有能力",
            "text": "透明 FP 薄膜可以提供小接收区域、宽带和较高灵敏度。"
          },
          {
            "label": "当前障碍",
            "text": "逐点读取数万个位置需要分钟级时间，运动会使不同时刻的结构错位。"
          },
          {
            "label": "本篇目标",
            "text": "保留三维细节，同时缩短采集，支持探头定位、动态观察与探索性临床使用。"
          }
        ],
        "takeaway": "速度必须放回图像质量、视野与整个处理流程中评价。",
        "sourcePage": 2
      },
      {
        "id": "architecture",
        "section": "系统构型",
        "title": "一束光激发，多束光读取",
        "sourceNote": "原文第 2–3 页，图 1a。",
        "layout": "wide",
        "lead": "宽场脉冲光让组织产生超声；连续光通过 FP 腔的反射变化读取返回声波。",
        "figureIds": [
          "fig-1a"
        ],
        "paragraphs": [
          "连续激光经光纤分为 64 路，形成 4×16 光斑阵列，反射光回到独立光电检测器与采集通道。两束光的功能不同，FP 薄膜也不直接生成血管图。"
        ],
        "sourcePage": 3
      },
      {
        "id": "parallel",
        "section": "核心加速机制",
        "title": "64 路不等于 64 个像素",
        "sourceNote": "原文第 3–5 页；学习笔记第 23–25 页。",
        "layout": "text",
        "lead": "一条 A-line 是一个检测位置上、一次激发后记录的时间波形。",
        "flow": [
          {
            "label": "一次激发",
            "text": "组织发出一组超声波。"
          },
          {
            "label": "并行记录",
            "text": "64 个通道各保存一条时间波形。"
          },
          {
            "label": "移动光斑阵列",
            "text": "下一次激发读取另一组位置。"
          },
          {
            "label": "覆盖接收面",
            "text": "积累数万测点，再重建三维图像。"
          }
        ],
        "takeaway": "本文成像使用单次激发采集，不作信号平均。",
        "sourcePage": 3
      },
      {
        "id": "uniformity",
        "section": "并行化的工程代价",
        "title": "共同波长要求均匀薄膜",
        "sourceNote": "原文第 3–5 页，图 1e；学习笔记第 24–25 页。",
        "layout": "split",
        "lead": "64 束光共享波长，但每个位置都要尽量落在灵敏的干涉曲线陡坡。",
        "paragraphs": [
          "膜厚变化会移动最佳偏置波长。文中示例对同时覆盖的局部区域提出约 1.3 nm 的膜厚变化要求；这说明并行化依赖制造精度。"
        ],
        "figureIds": [
          "fig-1e"
        ],
        "takeaway": "单束与多束噪声等效压力分布相近，支持整体灵敏度保持；不能推成每个位置完全相同。",
        "sourcePage": 3
      },
      {
        "id": "budget",
        "section": "采集时间预算",
        "title": "5.4 秒由哪些量决定",
        "sourceNote": "原文图 2 及第 5 页；学习笔记第 23–24 页。",
        "layout": "text",
        "lead": "常规模式每次收 64 条波形，每秒激发 100 次，最终需要 34,560 条波形。",
        "metrics": [
          {
            "value": "6,400",
            "label": "每秒获得的 A-line"
          },
          {
            "value": "540",
            "label": "凑齐一体积所需的激发次数"
          },
          {
            "value": "5.4 s",
            "label": "该模式报告的采集时间"
          }
        ],
        "relation": "34,560 条波形 ÷ 6,400 条每秒 = 5.4 秒",
        "takeaway": "这是给定模式的采集预算；扫描、传输、重建和显示的耗时需分别核对。",
        "sourcePage": 5
      },
      {
        "id": "resolution",
        "section": "性能标定",
        "title": "分辨率随位置变化",
        "sourceNote": "原文第 2–3 页，图 1c–d。",
        "layout": "split",
        "lead": "宽带与细密采样支持细节，但不能给整个视野贴一个最优数字。",
        "figureIds": [
          "fig-1cd"
        ],
        "points": [
          {
            "label": "横向",
            "text": "扫描中心、深度 1–12 mm 时，约从 60 增至 120 μm。"
          },
          {
            "label": "纵向",
            "text": "文中测得约 45 μm。"
          }
        ],
        "takeaway": "49 μm 读出光斑、54/108 μm 扫描步距和空间分辨率分别描述不同事情。",
        "sourcePage": 3
      },
      {
        "id": "anatomy",
        "section": "人体结构验证",
        "title": "从浅层网络读到深部血管",
        "sourceNote": "原文第 4–5 页，图 2c。",
        "layout": "wide",
        "lead": "先沿深度色标辨认血管层次，再查看不同深度范围的灰度投影。",
        "figureIds": [
          "fig-2c"
        ],
        "paragraphs": [
          "手掌图显示不同尺度血管和约 13 mm 深处结构；全文多部位示例的可见深度接近 15 mm。颜色表示深度，不能解释为血氧。"
        ],
        "takeaway": "最大强度投影把一段厚度内的强信号压到同一平面，交叉不自动表示血管连通。",
        "sourcePage": 4
      },
      {
        "id": "high-resolution",
        "section": "分辨率与时间的取舍",
        "title": "更细步距需要更长采集",
        "sourceNote": "原文第 6–7 页，图 4。",
        "layout": "wide",
        "lead": "高分辨率模式把步距减为 54 μm，呈现腕部和甲床更细的结构。",
        "figureIds": [
          "fig-4"
        ],
        "metrics": [
          {
            "value": "29 s",
            "label": "图 4 的采集时间"
          }
        ],
        "takeaway": "图 4 的细节、图 2 的 5.4 s 以及更快示例的时间，来自不同模式，不能合成一个配置的性能。",
        "sourcePage": 7
      },
      {
        "id": "high-prf",
        "section": "加速路径一",
        "title": "每秒激发更多次",
        "sourceNote": "原文第 6、8 页，图 5a；学习笔记第 87 页。",
        "layout": "wide",
        "lead": "保持并行通道后，提高激光重复率可以继续缩短采集。",
        "figureIds": [
          "fig-5a"
        ],
        "metrics": [
          {
            "value": "3.2 s",
            "label": "100 Hz 示例"
          },
          {
            "value": "1.6 s",
            "label": "200 Hz 示例"
          },
          {
            "value": "0.3 s",
            "label": "1 kHz 示例"
          }
        ],
        "takeaway": "波长、脉冲能量和光照条件也变化。前两组波长正文写 875 nm、图内写 850 nm，此处保留原文差异。",
        "sourcePage": 8
      },
      {
        "id": "subsampling",
        "section": "加速路径二",
        "title": "少采数据需要付出什么",
        "sourceNote": "原文第 6、8 页，图 5b；学习笔记第 89 页。",
        "layout": "wide",
        "lead": "利用图像的结构冗余，随机采集较少位置，再用带约束的迭代模型补足求解。",
        "figureIds": [
          "fig-5b"
        ],
        "points": [
          {
            "label": "采集减少",
            "text": "从全数据 5.4 s 降到 12.5% 数据对应约 0.7 s。"
          },
          {
            "label": "质量与计算代价",
            "text": "对比噪声比由 36 降至 25 dB；本例重建可达约 25 min。"
          }
        ],
        "takeaway": "0.7 s 采集不等于 0.7 s 得到最终图像。",
        "sourcePage": 8
      },
      {
        "id": "reconstruction",
        "section": "从波形到图像",
        "title": "定位直觉与实际算法",
        "sourceNote": "原文第 15 页；学习笔记第 86、89 页。",
        "layout": "text",
        "lead": "多个位置的到达时间共同约束内部声源，原始电压波形还不是血管像素。",
        "points": [
          {
            "label": "常规模式",
            "text": "论文报告通过 k-Wave 实现的 k 空间反投影。"
          },
          {
            "label": "图 5b 欠采样模式",
            "text": "最小二乘数据项、总变分正则化和非负约束共同求解。"
          },
          {
            "label": "二维接收聚焦",
            "text": "多排测量随深度聚焦，减小切面外信号的影响。"
          }
        ],
        "takeaway": "笔记中的延迟求和例子帮助理解定位，不能当成论文实际代码；网页不扩展原文未披露的调用细节。",
        "sourcePage": 15
      },
      {
        "id": "dynamic-2d",
        "section": "动态成像",
        "title": "二维采集与在线显示",
        "sourceNote": "原文第 6–9 页，图 6a；学习笔记第 86 页。",
        "layout": "wide",
        "lead": "沿一条线扫描多排光斑，可以较快更新一个切面，用于探头定位或观察动脉搏动。",
        "figureIds": [
          "fig-6a"
        ],
        "metrics": [
          {
            "value": "30 ms",
            "label": "每帧数据扫描"
          },
          {
            "value": "33 fps",
            "label": "离线示例的采集帧率"
          },
          {
            "value": "25 fps",
            "label": "另一个在线重建显示示例"
          }
        ],
        "takeaway": "30 ms 首先描述数据采集，不能据此认定完整重建只需 30 ms。",
        "sourcePage": 9
      },
      {
        "id": "dynamic-3d",
        "section": "动态成像",
        "title": "滑窗刷新并非独立体积率",
        "sourceNote": "原文第 8 页，图 6b；学习笔记第 89 页。",
        "layout": "wide",
        "lead": "每个体积使用 0.6 s 内的数据，滑窗每次前进 10%，可以平滑显示探头移动。",
        "figureIds": [
          "fig-6b"
        ],
        "metrics": [
          {
            "value": "0.6 s",
            "label": "单个体积的数据时间窗"
          },
          {
            "value": "16.7 fps",
            "label": "该离线例子的刷新率"
          }
        ],
        "takeaway": "相邻帧约共享 90% 数据；刷新更频繁，并不意味着每秒独立测量 16.7 个全新体积。",
        "sourcePage": 9
      },
      {
        "id": "reperfusion",
        "section": "动态功能示例",
        "title": "阻断解除后信号怎样恢复",
        "sourceNote": "原文第 8–10 页，图 6c。",
        "layout": "wide",
        "lead": "袖带暂时阻断上臂动脉供血后松开，连续记录下游指尖血管。",
        "figureIds": [
          "fig-6c"
        ],
        "paragraphs": [
          "血管区域的归一化光声信号随恢复灌注而增加，指动脉先于部分静脉区域恢复；表皮信号相对稳定，为血管相关解释提供参照。"
        ],
        "takeaway": "这里观察的是图像与相对信号变化，未直接测得绝对血流速度或定量血氧。",
        "sourcePage": 9
      },
      {
        "id": "clinical",
        "section": "探索性临床研究",
        "title": "病例图像支持到哪一步",
        "sourceNote": "原文第 10–12 页，图 7。",
        "layout": "wide",
        "lead": "足背病例显示血管形态和迂曲差异，用来检验患者扫描的可行性。",
        "figureIds": [
          "fig-7"
        ],
        "paragraphs": [
          "临床部分并非都使用 64 束模式；图 7 给出 16 束、约 15 s 扫描。作者明确这不是完整临床验证。"
        ],
        "takeaway": "不能仅从病例图建立普遍诊断阈值、敏感度或特异度。",
        "sourcePage": 10
      },
      {
        "id": "inflammation",
        "section": "探索性临床研究",
        "title": "把炎症随访转成图像指标",
        "sourceNote": "原文第 11–13 页，图 8a。",
        "layout": "wide",
        "lead": "同一区域反复观察，可以检查可见血管网络怎样随炎症消退变化。",
        "figureIds": [
          "fig-8a"
        ],
        "paragraphs": [
          "图 8a 的图像与血管骨架用于估算可分辨血管密度。另一项关节比较含 7 名活动期患者的 17 个关节与 5 名健康者的 44 个关节，仍属于探索性证据。"
        ],
        "takeaway": "血管密度、高于背景的体素数和绝对血容量是不同量；处理阈值与可见分辨率会影响指标。",
        "sourcePage": 13
      },
      {
        "id": "conclusions",
        "section": "结论与边界",
        "title": "快起来之后仍要保留条件",
        "sourceNote": "原文第 12–13 页讨论；学习笔记第 87–89 页。",
        "layout": "text",
        "lead": "这项工作把 FP 的细致三维血管成像推进到更实用的人体采集速度。",
        "points": [
          {
            "label": "系统贡献",
            "text": "多束读出和高均匀膜层让并行加速与灵敏度相容。"
          },
          {
            "label": "性能代价",
            "text": "更高重复率和欠采样分别受到光能、采样质量、视野及重建计算约束。"
          },
          {
            "label": "动态边界",
            "text": "二维帧率、三维刷新率、独立数据时间窗需要分别表述。"
          },
          {
            "label": "临床边界",
            "text": "证明可行性与应用潜力，尚未建立普遍诊断或绝对生理量化能力。"
          }
        ],
        "sourcePage": 12
      },
      {
        "id": "sources",
        "section": "资料与参考来源",
        "title": "原始文件与完整学习笔记",
        "sourceNote": "两份 PDF 均来自指定 Zotero 条目，按 SHA-256 核对；未修改上传原文件。",
        "layout": "references",
        "lead": "原文附件 23 页；个人学习笔记 89 页。正式卷期为 2025，首次在线发表为 2024。",
        "paragraphs": [
          "网页提炼系统与证据主线；完整教学、原始追问、公式及编校说明继续保留在笔记 PDF。"
        ]
      }
    ]
  }
}
---
