---
{
  "slug": "zhang-2008-fp-pat",
  "title": "Backward-mode multiwavelength photoacoustic scanner using a planar Fabry-Perot polymer film ultrasound sensor for high-resolution three-dimensional imaging of biological tissues",
  "category": "pact",
  "status": "published",
  "summary": "以透明 Fabry–Perot 聚合物薄膜接收超声，在组织同侧完成激发与探测；通过灵敏度、带宽、分辨率标定及三维血管仿体、多波长实验验证系统能力。",
  "journal": "Applied Optics",
  "year": 2008,
  "authors": [
    "Edward Zhang",
    "Jan Laufer",
    "Paul Beard"
  ],
  "doi": "10.1364/AO.47.000561",
  "tags": [
    "Fabry–Perot",
    "Backward mode",
    "Optical ultrasound detection",
    "Multiwavelength",
    "学习笔记"
  ],
  "updated": "2026-10-13",
  "downloads": {
    "pdf": {
      "url": "/library/zhang-2008-fp-pat/original.pdf",
      "label": "zhang-2008-fp-pat-original.pdf",
      "size": "3.82 MB"
    },
    "notes": {
      "url": "/library/zhang-2008-fp-pat/reading-notes.pdf",
      "label": "zhang-2008-fp-pat-reading-notes.pdf",
      "size": "7.51 MB"
    }
  },
  "references": [
    {
      "title": "Zhang 等，2008，Applied Optics。DOI: 10.1364/AO.47.000561",
      "url": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "title": "UCL：Photoacoustic Imaging Group 的研究方向",
      "url": "https://www.ucl.ac.uk/engineering/steapp/collaborate/policy-impact-unit/current-projects-and-publications/photoacoustic-imaging"
    }
  ],
  "team": {
    "name": "UCL 光声成像研究团队",
    "institution": "英国伦敦大学学院，医学物理与生物工程系（论文发表时）",
    "mainWork": [
      "本篇由 Edward Zhang、Jan Laufer 与 Paul Beard 完成，研究透明聚合物薄膜传感器、光学读出及反射式三维光声扫描系统。",
      "UCL 官方介绍的团队方向包括光声探测与激发器件、无创扫描仪和内窥探头、传播模型、重建与光谱方法，以及临床和生命科学应用。"
    ],
    "sources": [
      {
        "title": "Zhang 等，2008，Applied Optics。DOI: 10.1364/AO.47.000561",
        "url": "https://doi.org/10.1364/AO.47.000561"
      },
      {
        "title": "UCL：Photoacoustic Imaging Group 的研究方向",
        "url": "https://www.ucl.ac.uk/engineering/steapp/collaborate/policy-impact-unit/current-projects-and-publications/photoacoustic-imaging"
      }
    ]
  },
  "problem": "研究者想观察皮肤下方的微血管，但只能从组织同一侧送光、收声。高密度压电阵列通常不透明，容易遮挡激发光；若抬高阵列从侧面照明，又增加声传播距离、降低有效孔径。与此同时，浅表细节需要几十兆赫兹带宽和很小的接收单元，压电单元缩小后灵敏度往往下降。本文试图用一块透明、连续的光学薄膜，同时解决光路通行和微小单元的灵敏接收。",
  "materials": [
    {
      "title": "透明 FP 传感头",
      "text": "在聚甲基丙烯酸甲酯基底上，用两层二向色介质镜夹住 Parylene C 聚合物薄膜，形成 Fabry–Perot（法布里–珀罗，FP）干涉腔。研究比较 22 与 38 μm 两种间隔层；600–1200 nm 激发光可穿透，约 1550 nm 的连续读出光则在腔内反射干涉。",
      "figureIds": [
        "fig-1",
        "fig-2"
      ]
    },
    {
      "title": "用于分层验证的仿体",
      "text": "吸收条带用于测量线扩散函数；染料管和打结管用于检查任意形状重建；62–300 μm 内径的充血管置于散射液中模拟血管网络；三种吸收谱不同的染料用于验证多波长区分。本文主要展示仿体实验，没有完成临床或活体组织验证。",
      "figureIds": [
        "fig-12",
        "fig-15"
      ]
    }
  ],
  "methods": [
    {
      "title": "两束光分工完成激发与读出",
      "text": "脉冲激发光穿过透明传感头进入目标，吸收后产生的超声返回薄膜，使腔的光学厚度发生微小变化。另一束约 1550 nm 连续激光在薄膜上逐点扫描，反射功率的变化由光电二极管与跨阻放大器转换成电信号。示波器记录每个位置的一整条时间波形，计算机保存全部位置的数据。",
      "figureIds": [
        "fig-4"
      ]
    },
    {
      "title": "先设偏置，再记录波形",
      "text": "由于不同位置膜厚略有差别，每到新位置先扫描读出波长，拟合反射传输曲线，再把激光设置在曲线最陡的位置。这样，同样小的声压变化可产生较大的反射功率变化。记录信号还要按该位置相位灵敏度归一化，减小位置间读出差异。",
      "figureIds": [
        "fig-5"
      ]
    },
    {
      "title": "由二维时空波形恢复三维图像",
      "text": "一个接收位置只能给出传播时间约束，不能单独确定声源方向。扫描得到的是两个接收坐标加时间的波形集合；作者采用平面几何的解析逆 k 空间方法，将空间和时间频谱按声传播关系映射，再逆变换得到初始压力的三维分布。完整数学教学保留在 51 页学习笔记中。",
      "figureIds": []
    }
  ],
  "innovations": [
    {
      "title": "透明反射式接收",
      "before": "不透明的高密度接收面会遮挡组织同侧的激发光。",
      "change": "将透明波段与干涉读出波段分开，使激发光穿过 FP 传感头，超声从同侧返回。",
      "why": "二向色镜可对不同波段分别表现为高透射与高反射，因此同一薄膜既让激发光通过，又支持高灵敏干涉读出。",
      "evidence": "原文图 1–4 给出传感层、透射谱与完整系统；图 15 在反射式条件下重建充血管网络。",
      "tradeoff": "依赖精密膜层制造、逐点偏置和光学扫描；平面有限孔径使横向分辨率随深度和偏离中心而变化。",
      "figureIds": [
        "fig-4"
      ]
    },
    {
      "title": "小接收区域与宽带灵敏探测",
      "before": "缩小压电元件有利于接收高频与大角度声波，却常损失灵敏度。",
      "change": "用聚焦读出光斑在连续薄膜上定义接收区域，并以膜厚调节声学带宽。",
      "why": "接收位置由光学扫描选择；聚合物薄膜的声学响应支持宽频带，但有效接收尺寸仍受膜厚与声学传播影响。",
      "evidence": "20 MHz 测量带宽下，38 μm 膜的峰值噪声等效压力约 0.21 kPa，22 μm 膜约 0.31 kPa；对应负三分贝带宽约 22.2 与 39 MHz。",
      "tradeoff": "较薄膜提升带宽，但本实验灵敏度并未同步提高；64 μm 光斑也不能直接当作有效声学单元或系统分辨率。",
      "figureIds": [
        "fig-6"
      ]
    },
    {
      "title": "多波长结构区分",
      "before": "单幅吸收图可以显示位置，却难以区分吸收谱不同的物质。",
      "change": "在 643、746、822 nm 分别激发同一组三种染料管。",
      "why": "不同染料对激发波长的吸收不同，改变波长后，相应管子的图像对比随之变化。",
      "evidence": "图 17 给出染料吸收谱，图 18 的三组图像与谱峰位置对应。",
      "tradeoff": "这是光谱区分可行性验证；没有因此直接得到组织内定量血氧图，仍需处理光通量等影响。",
      "figureIds": [
        "fig-17",
        "fig-18"
      ]
    }
  ],
  "results": [
    {
      "title": "横向与纵向分辨率需要分开解释",
      "text": "22 μm 膜、短脉冲与细步距条件下，中心附近最佳横向线扩散宽度约 38 μm，随深度和偏离孔径中心而展宽。纵向薄墨层测试实测约 19 μm；文中 15 μm 是按声学膜厚得到的估计，不应混写成实测值。",
      "figureIds": [
        "fig-10"
      ]
    },
    {
      "title": "三维血管仿体",
      "text": "散射液中充血管的重建结果与照片相符；显示的管径为 62–300 μm，图 15 最深可识别管位于距探测面约 5.5 mm。文中提到距探测面约 10 mm 的中心管未识别，不能把未来 10 mm 深度预期写成已达成结果。",
      "figureIds": [
        "fig-15"
      ]
    },
    {
      "title": "采集仍是主要瓶颈",
      "text": "当前装置每个扫描位置约需 1 s，主要耗时来自示波器重置与逐条向计算机传输。作者提出分段存储、一次性下载及并行读出作为加速方向，本文未实现实时三维成像。",
      "figureIds": []
    }
  ],
  "conclusions": [
    "透明 FP 薄膜把同侧照明、小接收单元和宽带探测整合到一套可运行的三维光声系统。",
    "仿体结果支持其短距离高分辨率结构成像与多波长区分能力；证据范围应保留在对应实验条件内。",
    "系统的主要瓶颈仍是逐点扫描与数据传输；本文为后续多束并行 FP 扫描提供工程基础。",
    "完整原文 17 页与个人学习笔记 51 页原样保留，网页提炼系统主线、关键原图及易混指标。"
  ],
  "figures": [
    {
      "id": "fig-1",
      "src": "/library/zhang-2008-fp-pat/fig-1.webp",
      "width": 720,
      "height": 366,
      "alt": "基底、二向色镜和 Parylene 间隔层构成的透明 FP 传感头",
      "caption": "两层反射镜夹住聚合物间隔层；超声使腔的光学厚度变化。",
      "attribution": "Zhang 等，2008，Applied Optics，图 1（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-2",
      "src": "/library/zhang-2008-fp-pat/fig-2.webp",
      "width": 720,
      "height": 462,
      "alt": "介质镜对激发波段高透射、对读出波段高反射的光谱曲线",
      "caption": "先看两段波长的不同任务：激发光穿透，连续光在腔内干涉读出。",
      "attribution": "Zhang 等，2008，Applied Optics，图 2（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-4",
      "src": "/library/zhang-2008-fp-pat/fig-4.webp",
      "width": 1503,
      "height": 1137,
      "alt": "包含激发激光、连续读出激光、振镜、光电二极管、示波器和计算机的扫描系统",
      "caption": "沿脉冲光到目标，再沿返回超声、FP 调制和光电检测读完整条链。",
      "attribution": "Zhang 等，2008，Applied Optics，图 4（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-5",
      "src": "/library/zhang-2008-fp-pat/fig-5.webp",
      "width": 720,
      "height": 441,
      "alt": "FP 反射传输曲线及其相位灵敏度随波长的变化",
      "caption": "最灵敏工作点在反射曲线陡坡上；不同扫描点需重新确定合适波长。",
      "attribution": "Zhang 等，2008，Applied Optics，图 5（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-6",
      "src": "/library/zhang-2008-fp-pat/fig-6.webp",
      "width": 720,
      "height": 666,
      "alt": "38 与 22 微米膜厚的理论及实测声学频率响应",
      "caption": "曲线与测量点比较两种膜厚；负三分贝带宽与首个响应零点是不同指标。",
      "attribution": "Zhang 等，2008，Applied Optics，图 6（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-10",
      "src": "/library/zhang-2008-fp-pat/fig-10.webp",
      "width": 720,
      "height": 825,
      "alt": "两种膜厚下横向线扩散函数宽度随横向位置和深度的等高线图",
      "caption": "数字表示微米级的线扩散宽度；中心附近更细，变深或偏离中心后展宽。",
      "attribution": "Zhang 等，2008，Applied Optics，图 10（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-12",
      "src": "/library/zhang-2008-fp-pat/fig-12.webp",
      "width": 720,
      "height": 522,
      "alt": "打结染料管照片与三个方向最大强度投影的对照",
      "caption": "三个投影对应同一三维数据；照片用来核对形状，投影并不是独立切片。",
      "attribution": "Zhang 等，2008，Applied Optics，图 12（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-15",
      "src": "/library/zhang-2008-fp-pat/fig-15.webp",
      "width": 1500,
      "height": 735,
      "alt": "充血管网络照片与三维光声重建图",
      "caption": "照片与重建的对应支持血管网络成像，A、B 分别标出浅管与深管。",
      "attribution": "Zhang 等，2008，Applied Optics，图 15（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-17",
      "src": "/library/zhang-2008-fp-pat/fig-17.webp",
      "width": 720,
      "height": 522,
      "alt": "三种近红外染料在不同波长的吸收谱",
      "caption": "先确认每种染料的谱峰，再解释图 18 为什么在不同波长亮起不同管子。",
      "attribution": "Zhang 等，2008，Applied Optics，图 17（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    },
    {
      "id": "fig-18",
      "src": "/library/zhang-2008-fp-pat/fig-18.webp",
      "width": 576,
      "height": 1062,
      "alt": "643、746 和 822 纳米下三根染料管的光声图像",
      "caption": "几何位置保持不变，对比随波长改变；说明光谱区分能力。",
      "attribution": "Zhang 等，2008，Applied Optics，图 18（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1364/AO.47.000561"
    }
  ],
  "presentation": {
    "title": "Zhang 等（2008）文献汇报",
    "language": "zh-CN",
    "slides": [
      {
        "id": "overview",
        "section": "文献汇报 / ZHANG 等，2008",
        "title": "透明薄膜上的三维光声探测",
        "sourceNote": "原文第 561–577 页；图 4、15。",
        "layout": "cover",
        "lead": "只能从组织一侧照明时，怎样让光穿过接收面，又灵敏地听到浅表微血管的声音？",
        "figureIds": [
          "fig-4"
        ],
        "metrics": [
          {
            "value": "17 页",
            "label": "论文原文"
          },
          {
            "value": "51 页",
            "label": "完整学习笔记"
          }
        ],
        "sourcePage": 5
      },
      {
        "id": "publication-team",
        "section": "期刊与研究团队",
        "title": "论文与团队背景",
        "sourceNote": "原文第 561 页；团队方向见 UCL 官方介绍。",
        "layout": "text",
        "lead": "Applied Optics · 47(4): 561–577 · 2008 · DOI: 10.1364/AO.47.000561",
        "points": [
          {
            "label": "研究团队",
            "text": "Edward Zhang、Jan Laufer、Paul Beard，伦敦大学学院医学物理与生物工程系。"
          },
          {
            "label": "本文任务",
            "text": "将透明 FP 传感器、自动偏置和二维扫描整合为反射式三维、多波长光声仪器。"
          },
          {
            "label": "团队工作",
            "text": "UCL 团队研究探测与激发器件、扫描系统、模型、重建、光谱及临床应用。"
          }
        ],
        "sources": [
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
        "title": "同侧照明为什么难",
        "sourceNote": "原文第 562–563 页；学习笔记第 6 页。",
        "layout": "text",
        "lead": "目标在皮肤下面。激发光需要进去，超声需要出来，两条路径却要使用同一侧空间。",
        "points": [
          {
            "label": "光路被接收面挡住",
            "text": "不透明的高密度压电阵列难以让光从正面进入；抬高阵列侧向送光会增加声程。"
          },
          {
            "label": "小元件听不清弱信号",
            "text": "细结构包含高频成分，需要小接收单元与宽频响应；压电元件缩小时灵敏度往往下降。"
          }
        ],
        "takeaway": "本文要同时满足透明、小接收区域、宽带和灵敏度，而不是只优化一个指标。",
        "sourcePage": 2
      },
      {
        "id": "sensor",
        "section": "材料与探测原理",
        "title": "声压怎样变成光强变化",
        "sourceNote": "原文第 564–566 页，图 1。",
        "layout": "split",
        "lead": "法布里–珀罗干涉腔由两面镜子和中间的聚合物薄膜组成。",
        "paragraphs": [
          "超声到达时改变腔的光学厚度，反射光的干涉状态随之改变；已有的连续读出光因此产生功率变化，再由光电探测器记录。"
        ],
        "figureIds": [
          "fig-1"
        ],
        "takeaway": "FP 并不产生新的光；它把声压变化调制到读出光上。",
        "sourcePage": 4
      },
      {
        "id": "two-wavelengths",
        "section": "系统构型",
        "title": "两束光承担不同任务",
        "sourceNote": "原文第 564–566 页，图 2、4。",
        "layout": "split",
        "lead": "激发光负责让组织发声，连续读出光负责测量薄膜的响应。",
        "points": [
          {
            "label": "600–1200 nm 激发",
            "text": "二向色镜在该波段高透射，脉冲光可穿过传感头。"
          },
          {
            "label": "约 1550 nm 读出",
            "text": "镜面在该波段高反射，聚焦光斑在薄膜上扫描并读取声压调制。"
          }
        ],
        "figureIds": [
          "fig-2"
        ],
        "sourcePage": 5
      },
      {
        "id": "readout",
        "section": "采集与读出",
        "title": "从目标到数字波形",
        "sourceNote": "原文第 565–567 页，图 4。",
        "layout": "wide",
        "lead": "每次扫描选择一个接收位置，记录的是整条时间波形。",
        "figureIds": [
          "fig-4"
        ],
        "flow": [
          {
            "label": "脉冲激发",
            "text": "目标吸收光并产生超声。"
          },
          {
            "label": "薄膜调制",
            "text": "返回声波改变 FP 光学厚度。"
          },
          {
            "label": "光电检测",
            "text": "光电二极管与跨阻放大器输出电信号。"
          },
          {
            "label": "记录与换点",
            "text": "示波器采集，计算机保存后移动光斑。"
          }
        ],
        "sourcePage": 5
      },
      {
        "id": "bias",
        "section": "读出工作点",
        "title": "先找陡坡，再测小变化",
        "sourceNote": "原文第 566 页，图 5；学习笔记的偏置教学。",
        "layout": "split",
        "lead": "同样的微小声压，如果读出波长落在曲线平坦处，就不容易看见。",
        "paragraphs": [
          "逐点扫描波长，拟合反射曲线并寻找最大斜率；记录波形后按该位置灵敏度修正，减小膜厚和镜面差异的影响。"
        ],
        "figureIds": [
          "fig-5"
        ],
        "takeaway": "最佳波长是一个需要校准的工作点，不能对整片薄膜直接作同一假设。",
        "sourcePage": 6
      },
      {
        "id": "bandwidth-sensitivity",
        "section": "性能与代价",
        "title": "膜厚、带宽与灵敏度",
        "sourceNote": "原文第 567–569 页，图 6；学习笔记第 17 页。",
        "layout": "split",
        "lead": "较薄膜把高频响应扩展得更远，但灵敏度还受干涉腔质量和读出噪声影响。",
        "figureIds": [
          "fig-6"
        ],
        "points": [
          {
            "label": "38 μm 膜",
            "text": "负三分贝带宽约 22.2 MHz；峰值噪声等效压力约 0.21 kPa。"
          },
          {
            "label": "22 μm 膜",
            "text": "负三分贝带宽约 39 MHz；峰值噪声等效压力约 0.31 kPa。"
          }
        ],
        "takeaway": "两项噪声等效压力都在 20 MHz 测量带宽下给出；带宽更高不等于本实验灵敏度也更高。",
        "sourcePage": 8
      },
      {
        "id": "sampling",
        "section": "采样与分辨率",
        "title": "三个尺寸不能混用",
        "sourceNote": "原文第 567–569 页；学习笔记第 17、51 页。",
        "layout": "text",
        "lead": "扫描步距、读出光斑和有效声学单元描述的是不同事情。",
        "metrics": [
          {
            "value": "10 μm",
            "label": "可设定的最小扫描步距"
          },
          {
            "value": "64 μm",
            "label": "读出光斑直径"
          },
          {
            "value": "≈70 / 90 μm",
            "label": "22 / 38 μm 膜的模型有效单元"
          }
        ],
        "paragraphs": [
          "步距表示相邻测点间隔；光斑表示读取区域；有效声学尺寸还受膜内传播影响。最终图像能分开多细的结构，必须通过完整系统标定回答。"
        ],
        "sourcePage": 8
      },
      {
        "id": "resolution",
        "section": "标定与实验结果",
        "title": "怎样测量分辨率",
        "sourceNote": "原文第 569–571 页，图 7–10；学习笔记第 20、51 页。",
        "layout": "split",
        "lead": "作者先成像已知吸收条带，从边缘变化求线扩散宽度，再比较不同位置。",
        "figureIds": [
          "fig-10"
        ],
        "metrics": [
          {
            "value": "≈38 μm",
            "label": "最佳横向线扩散宽度"
          },
          {
            "value": "≈19 μm",
            "label": "22 μm 膜的纵向实测值"
          }
        ],
        "takeaway": "15 μm 是纵向声学膜厚估计；实测约 19 μm。横向分辨率也会随位置变化。",
        "sourcePage": 11
      },
      {
        "id": "reconstruction",
        "section": "原始数据与重建",
        "title": "波形集合怎样成为三维图",
        "sourceNote": "原文第 569 页；学习笔记第 18–19、51 页。",
        "layout": "text",
        "lead": "接收面只有两个坐标，但每个坐标都保存了一条随时间变化的波形。",
        "flow": [
          {
            "label": "汇集时空波形",
            "text": "已知各接收位置与采样时间。"
          },
          {
            "label": "变换到频域",
            "text": "将空间与时间变化分解为频率成分。"
          },
          {
            "label": "按传播关系映射",
            "text": "利用声速和波动规律寻找三维空间频谱。"
          },
          {
            "label": "回到空间图像",
            "text": "逆变换恢复初始压力分布。"
          }
        ],
        "takeaway": "网页保留算法任务与输入输出，详细公式和学习问答请查看完整笔记；单条波形并不是一个深度像素。",
        "sourcePage": 9
      },
      {
        "id": "phantom",
        "section": "三维验证",
        "title": "先核对形状，再看血管",
        "sourceNote": "原文第 572–574 页，图 12、15。",
        "layout": "wide",
        "lead": "打结管和血管网络提供已知几何参照，用来检查重建是否还原三维结构。",
        "figureIds": [
          "fig-12",
          "fig-15"
        ],
        "paragraphs": [
          "图 12 比较染料管照片和三个方向的投影；图 15 用更接近真实吸收与散射条件的充血管网络检验三维成像。"
        ],
        "takeaway": "图 15 显示的最深管约距探测面 5.5 mm；这是仿体结果。",
        "sourcePage": 12
      },
      {
        "id": "spectral",
        "section": "多波长验证",
        "title": "改变颜色，区分吸收体",
        "sourceNote": "原文第 573–575 页，图 17、18。",
        "layout": "split",
        "lead": "同一组三根管子，在不同激发波长下显示不同对比。",
        "points": [
          {
            "label": "比较条件",
            "text": "643、746、822 nm 分别接近不同染料的吸收谱峰。"
          },
          {
            "label": "能支持什么",
            "text": "结构位置与亮度随吸收谱对应，支持多波长区分能力。"
          }
        ],
        "figureIds": [
          "fig-18"
        ],
        "takeaway": "多波长染料实验并不是定量血氧测量。",
        "sourcePage": 15
      },
      {
        "id": "limits",
        "section": "局限与后续路线",
        "title": "为什么还不能实时使用",
        "sourceNote": "原文第 567、575–576 页；学习笔记第 51 页。",
        "layout": "text",
        "lead": "成像质量得到验证后，实际使用首先被采集速度限制。",
        "points": [
          {
            "label": "当前瓶颈",
            "text": "每点约 1 s，主要是示波器重新准备和逐条传输，而非声波本身传播很慢。"
          },
          {
            "label": "作者提出的路线",
            "text": "分段存储后统一下载、提高激光重复频率、并行读取更多位置。"
          },
          {
            "label": "需要保留的代价",
            "text": "更高带宽、更细采样和更大孔径会改变数据量、噪声及实现复杂度。"
          },
          {
            "label": "证据边界",
            "text": "本文完成的是系统和仿体验证，未来性能预期不能列为已实现结果。"
          }
        ],
        "sourcePage": 15
      },
      {
        "id": "conclusions",
        "section": "结论与文献关系",
        "title": "这篇论文留下的系统基础",
        "sourceNote": "原文第 575–576 页；学习笔记第 50–51 页。",
        "layout": "text",
        "lead": "核心进展是透明 FP 探测、逐点偏置、二维声场采集和三维重建的系统整合。",
        "points": [
          {
            "label": "解决的困难",
            "text": "同侧照明与小单元灵敏探测可以兼顾。"
          },
          {
            "label": "建立的证据",
            "text": "用频率响应、线扩散标定、任意形状与多波长仿体逐层验证。"
          },
          {
            "label": "与后续文献的关系",
            "text": "后续 Huynh 的多束并行 FP 扫描继续处理速度瓶颈；这不是本文已达到的能力。"
          }
        ],
        "takeaway": "阅读时始终把性能数字连同膜厚、测量带宽、位置和实验对象一起保留。",
        "sourcePage": 15
      },
      {
        "id": "sources",
        "section": "资料与参考来源",
        "title": "原始文件与完整学习笔记",
        "sourceNote": "论文、学习笔记均来自本次指定的 Zotero 条目；文件按 SHA-256 核对，内容未经修改。",
        "layout": "references",
        "lead": "论文原文 17 页；完整学习笔记 51 页。网页是提炼汇报，完整教学、公式和原始问答保留在笔记中。"
      }
    ]
  }
}
---
