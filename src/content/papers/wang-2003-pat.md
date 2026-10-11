---
{
  "slug": "wang-2003-pat",
  "title": "Noninvasive laser-induced photoacoustic tomography for structural and functional in vivo imaging of the brain",
  "category": "pact",
  "status": "published",
  "summary": "Wang et al. demonstrate structural and functional photoacoustic imaging of the rat brain through skin and skull, using intrinsic absorption contrast and a scanning ultrasound detector.",
  "journal": "Nature Biotechnology",
  "year": 2003,
  "authors": [
    "Xueding Wang",
    "Yongjiang Pang",
    "Geng Ku",
    "Xueyi Xie",
    "George Stoica",
    "Lihong V. Wang"
  ],
  "doi": "10.1038/nbt839",
  "tags": [
    "Brain imaging",
    "Functional PAT",
    "Circular scanning",
    "Hemodynamics"
  ],
  "downloads": {
    "pdf": {
      "url": "/library/wang-2003-pat/original.pdf",
      "label": "Wang-2003-Original.pdf",
      "size": "956 KB"
    },
    "notes": {
      "url": "/library/wang-2003-pat/reading-notes.pdf",
      "label": "Wang-2003-Reading-Notes.pdf",
      "size": "1.95 MB"
    }
  },
  "team": {
    "name": "光学成像实验室与病理生物学系",
    "institution": "美国得克萨斯 A&M 大学（论文发表于 2003 年时的单位）",
    "mainWork": [
      "2003 年的研究团队：论文来自美国得克萨斯 A&M 大学，由生物医学工程的光学成像实验室与病理生物学系合作完成。第一作者为 Xueding Wang，通讯作者为 Lihong V. Wang；共同作者包括 Yongjiang Pang、Geng Ku、Xueyi Xie 和 George Stoica。",
      "本文的主要工作：把光激发、超声接收与图像重建结合起来，在保留头皮和颅骨的条件下，观察大鼠脑结构以及刺激引起的血流动力学变化。",
      "Lihong V. Wang 团队的后续方向：其加州理工学院实验室研究光声与热声成像、压缩超快摄影、量子成像和时间反演；组织中的光传输建模也是其长期研究基础。",
      "Xueding Wang 团队的后续方向：其密歇根大学实验室以光与超声开展生物医学成像和治疗，研究方向包括临床光声成像、光介导超声治疗及辐射诱导声学成像。"
    ],
    "sources": [
      {
        "title": "Wang et al. (2003). Nature Biotechnology 21, 803–806. DOI: 10.1038/nbt839",
        "url": "https://www.nature.com/articles/nbt839"
      },
      {
        "title": "加州理工学院光学成像实验室：研究方向",
        "url": "https://coilab.caltech.edu/research"
      },
      {
        "title": "密歇根大学：Xueding Wang 教师主页",
        "url": "https://bme.umich.edu/people/wang-xueding/"
      },
      {
        "title": "加州理工学院：Lihong Wang 的生物医学光学研究",
        "url": "https://mede.caltech.edu/news/lihong-wang-honored-with-a-special-issue-of-the-journal-of-biomedical-optics"
      }
    ]
  },
  "problem": "血液吸光强，适合显示血管。但光进入组织后会多次散射，仅凭返回表面的光，很难判断吸收发生在哪里。\n\n研究者希望看见颅骨下的脑结构。开颅能提供直接的光学观察窗口，却改变了实验条件。另一条路径是让被吸收的光产生短暂声压，再利用超声传播时间反推声源位置。",
  "materials": [
    {
      "title": "样本、对比来源与测量条件",
      "text": "研究对象：麻醉状态下的成年 Sprague-Dawley 大鼠，体重约 350 g。论文给出的平均头皮厚度约为 0.6 mm，颅骨厚度约为 0.8 mm。\n\n对比从哪里来：利用组织自身的光吸收，血红蛋白提供较强的血管对比；实验不依赖注射外源造影剂。\n\n光激发与超声接收：入射能量面密度低于 10 mJ/cm²，估计皮肤温升低于 20 mK。换能器负六分贝相对带宽为 88%，柱面聚焦直径约为 1 mm。\n\n如何核对成像结果：用组织等效仿体的线扩散函数评估分辨率；成像后拍摄解剖照片，并用皮层组织学切片核对空间位置。",
      "figureIds": []
    }
  ],
  "methods": [
    {
      "title": "实验系统如何工作",
      "text": "激光照亮头部较大的区域，单个超声探测器绕头部逐点扫描。\n\n光路：把激发光送到组织：反射镜改变光束方向，凹透镜扩束，毛玻璃使照明更均匀。\n\n声路与电路：把声压变成数据：水将声波耦合至 V383 换能器。声压转换为电信号后，由 500 PR 放大器放大，再由数字示波器记录波形。",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "从时间波形到空间图像",
      "text": "我们已经有各个探测位置的时间波形，现在要回答：图像中某个位置吸收了多少光？\n\n先在图像中选一个候选位置。声速已知时，它到探测器的距离决定声波何时到达。重建就在相应时刻读取波形，经原文公式 1 的处理后，把不同探测角度的贡献汇总到这个位置。\n\n选定像素：设定视野，并给出待重建位置的坐标。\n\n计算到达时间：由像素到探测器的距离和假定声速求得。\n\n处理时间波形：在该时刻读取信号的时间导数，并按公式 1 加权。\n\n汇总多个角度：累加环形扫描各位置的贡献，再逐个处理其余像素。",
      "figureIds": []
    }
  ],
  "innovations": [
    {
      "title": "透过头皮和颅骨的结构成像",
      "before": "组织强散射使纯光学经颅定位受到限制。",
      "change": "结合宽区域光照、多角度声学探测和断层重建。",
      "why": "被吸收的光产生声压波，声波传播时间为声源位置提供约束。",
      "evidence": "图 2 显示 PAT 结构与成像后解剖照片对应；血管相对背景的对比为 2.3–7.9，平面内分辨率约为 0.2 mm。",
      "tradeoff": "单探测器扫描每幅图约需 16 min；有限带宽和照明条件影响结果的解释。",
      "figureIds": [
        "fig-2"
      ]
    },
    {
      "title": "分离刺激相关的功能响应",
      "before": "静态吸收图无法分离刺激引起的生理变化。",
      "change": "将左右侧胡须刺激图分别减去静息 PAT 图，并与解剖位置对应。",
      "why": "差分图强调与血管响应相关的吸收变化。",
      "evidence": "图 4 显示对侧半球响应，并有解剖和组织学对应；大血管相对吸收变化最高达 8%。",
      "tradeoff": "这是间接血流动力学测量。单波长不能定量获得血氧饱和度，血管响应的传播也限制了对神经活动源的定位特异性。",
      "figureIds": [
        "fig-4"
      ]
    }
  ],
  "results": [
    {
      "title": "能否定位皮层损伤",
      "text": "PAT 在右侧皮层显示了浅表损伤。随后拍摄的解剖照片用于核对损伤的位置和形状。\n\n损伤由针穿过头皮和颅骨造成。成像时无需打开颅窗，但造模本身有创；这项实验也不能直接证明对某种疾病具有特异诊断能力。",
      "figureIds": [
        "fig-3"
      ]
    },
    {
      "title": "分辨率与采集时间",
      "text": "通过仿体的线扩散函数估计平面内分辨率约为 0.2 mm。以 1.5° 步长完成环形扫描，每个位置约 4 s，一幅图像约需 16 min。",
      "figureIds": []
    }
  ],
  "conclusions": [
    "核心贡献是在活体大鼠中，整合展示了透过头皮和颅骨的脑结构与功能光声成像。",
    "利用内源性吸收对比显示正常脑结构与人工诱导的浅表损伤，并与成像后的解剖照片对应。",
    "比较刺激与静息状态，得到具有左右侧对应关系的血管响应；解剖与组织学结果支持其空间定位。",
    "把宽区域光激发、多角度声学采集与重建串联起来，将光吸收转化为空间图像，为功能 PACT 提供实验基础。",
    "系统采集慢、采用单波长，反映的是间接血流动力学指标。实时成像和人脑成像在本文中仍是未来方向。"
  ],
  "figures": [
    {
      "id": "fig-1",
      "src": "/library/wang-2003-pat/fig-1.webp",
      "width": 992,
      "height": 644,
      "alt": "激光光路、水耦合扫描换能器、放大器、示波器与计算机组成的系统。",
      "caption": "右侧为光激发链路，左侧为声学接收与电信号读出链路。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 1。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-2",
      "src": "/library/wang-2003-pat/fig-2.webp",
      "width": 1004,
      "height": 544,
      "alt": "大鼠脑光声图像与成像后开颅拍摄的解剖照片对照。",
      "caption": "a：透过头皮和颅骨获得的 PAT 图像。b：随后取得的解剖参照照片。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 2。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-3",
      "src": "/library/wang-2003-pat/fig-3.webp",
      "width": 996,
      "height": 532,
      "alt": "光声图像中人工诱导的皮层损伤与解剖照片对照。",
      "caption": "a 中标出的损伤，与 b 中勾画的区域相对应。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 3。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4",
      "src": "/library/wang-2003-pat/fig-4.webp",
      "width": 976,
      "height": 1100,
      "alt": "基线血管图、左右侧胡须刺激差分图、解剖照片及桶状皮层组织学图。",
      "caption": "原始面板依次呈现结构、功能响应及解剖定位证据。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 4。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4a",
      "src": "/library/wang-2003-pat/fig-4a.webp",
      "width": 492,
      "height": 528,
      "alt": "视野为 2 cm × 2 cm 的皮层浅表血管基线光声图像。",
      "caption": "透过头皮和颅骨获得的皮层血管图像。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 4a（原图面板裁剪）。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4b",
      "src": "/library/wang-2003-pat/fig-4b.webp",
      "width": 464,
      "height": 528,
      "alt": "左侧胡须刺激时，差分吸收信号叠加在皮层血管图上。",
      "caption": "刺激左侧胡须：响应位于对侧半球。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 4b（原图面板裁剪）。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4c",
      "src": "/library/wang-2003-pat/fig-4c.webp",
      "width": 492,
      "height": 540,
      "alt": "右侧胡须刺激时，差分吸收信号叠加在皮层血管图上。",
      "caption": "刺激右侧胡须：响应随之转向另一侧。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 4c（原图面板裁剪）。",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4de",
      "src": "/library/wang-2003-pat/fig-4de.webp",
      "width": 408,
      "height": 556,
      "alt": "标出响应区域的解剖照片与皮层第四层桶状皮层组织学切片。",
      "caption": "d：解剖位置。e：用于核对定位的桶状皮层组织学图。",
      "attribution": "Wang 等，2003，Nature Biotechnology，图 4d–e（原图面板裁剪）。",
      "source": "https://www.nature.com/articles/nbt839"
    }
  ],
  "references": [
    {
      "title": "Wang et al. (2003). Nature Biotechnology 21, 803–806. DOI: 10.1038/nbt839",
      "url": "https://www.nature.com/articles/nbt839"
    },
    {
      "title": "加州理工学院光学成像实验室：研究方向",
      "url": "https://coilab.caltech.edu/research"
    },
    {
      "title": "加州理工学院：Lihong Wang 的生物医学光学研究",
      "url": "https://mede.caltech.edu/news/lihong-wang-honored-with-a-special-issue-of-the-journal-of-biomedical-optics"
    },
    {
      "title": "密歇根大学：Xueding Wang 教师主页",
      "url": "https://bme.umich.edu/people/wang-xueding/"
    },
    {
      "title": "密歇根大学光学成像实验室：研究方向",
      "url": "https://opticimage.engin.umich.edu/research/"
    }
  ],
  "presentation": {
    "title": "Wang 等（2003）文献汇报",
    "slides": [
      {
        "id": "overview",
        "section": "文献汇报 / WANG 等，2003",
        "layout": "cover",
        "title": "脑结构与功能的无创光声断层成像",
        "lead": "保留头皮和颅骨，能否看清脑血管，并定位它们对外界刺激的响应？",
        "figureIds": [
          "fig-4a"
        ],
        "metrics": [
          {
            "value": "≈0.2 mm",
            "label": "成像平面内分辨率"
          },
          {
            "value": "≈16 min",
            "label": "单幅图像采集时间"
          }
        ],
        "sourceNote": "Wang 等（2003），第 803–805 页，图 4a。",
        "sourcePage": 1
      },
      {
        "id": "publication-team",
        "section": "期刊与研究团队",
        "title": "论文与团队背景",
        "layout": "text",
        "lead": "Nature Biotechnology · 第 21 卷第 7 期 · 803–806 页 · 2003 年 6 月 15 日在线发表",
        "points": [
          {
            "label": "2003 年的研究团队",
            "text": "论文来自美国得克萨斯 A&M 大学，由生物医学工程的光学成像实验室与病理生物学系合作完成。第一作者为 Xueding Wang，通讯作者为 Lihong V. Wang；共同作者包括 Yongjiang Pang、Geng Ku、Xueyi Xie 和 George Stoica。"
          },
          {
            "label": "本文的主要工作",
            "text": "把光激发、超声接收与图像重建结合起来，在保留头皮和颅骨的条件下，观察大鼠脑结构以及刺激引起的血流动力学变化。"
          },
          {
            "label": "Lihong V. Wang 团队的后续方向",
            "text": "其加州理工学院实验室研究光声与热声成像、压缩超快摄影、量子成像和时间反演；组织中的光传输建模也是其长期研究基础。"
          },
          {
            "label": "Xueding Wang 团队的后续方向",
            "text": "其密歇根大学实验室以光与超声开展生物医学成像和治疗，研究方向包括临床光声成像、光介导超声治疗及辐射诱导声学成像。"
          }
        ],
        "sources": [
          {
            "title": "加州理工学院光学成像实验室：研究方向",
            "url": "https://coilab.caltech.edu/research"
          },
          {
            "title": "密歇根大学：Xueding Wang 教师主页",
            "url": "https://bme.umich.edu/people/wang-xueding/"
          }
        ],
        "sourceNote": "发表时的单位见原文第 803 页；后续研究方向见所附机构官网。",
        "sourcePage": 1
      },
      {
        "id": "research-problem",
        "section": "研究问题",
        "title": "用光产生对比，用声确定位置",
        "layout": "text",
        "lead": "血液吸光强，适合显示血管。但光进入组织后会多次散射，仅凭返回表面的光，很难判断吸收发生在哪里。",
        "paragraphs": [
          "研究者希望看见颅骨下的脑结构。开颅能提供直接的光学观察窗口，却改变了实验条件。另一条路径是让被吸收的光产生短暂声压，再利用超声传播时间反推声源位置。"
        ],
        "flow": [
          {
            "label": "短脉冲照明",
            "text": "激光脉冲到达组织。"
          },
          {
            "label": "局部吸收",
            "text": "沉积的光能引起微小、快速的温升。"
          },
          {
            "label": "产生超声",
            "text": "热弹性膨胀向外发出声压波。"
          },
          {
            "label": "接收并重建",
            "text": "从多个角度接收声波，定位吸收结构。"
          }
        ],
        "takeaway": "光声断层成像（photoacoustic tomography，PAT）把光吸收对比与声学探测结合起来。本文采用宽区域照明和多角度重建，在本站归入光声计算机断层成像（photoacoustic computed tomography，PACT）。",
        "sourceNote": "原文第 803 页；学习笔记第 5–14、78–79 页。",
        "sourcePage": 1
      },
      {
        "id": "system",
        "section": "系统与仪器",
        "layout": "wide",
        "title": "实验系统如何工作",
        "lead": "激光照亮头部较大的区域，单个超声探测器绕头部逐点扫描。",
        "points": [
          {
            "label": "光路：把激发光送到组织",
            "text": "反射镜改变光束方向，凹透镜扩束，毛玻璃使照明更均匀。"
          },
          {
            "label": "声路与电路：把声压变成数据",
            "text": "水将声波耦合至 V383 换能器。声压转换为电信号后，由 500 PR 放大器放大，再由数字示波器记录波形。"
          }
        ],
        "metrics": [
          {
            "value": "532 nm",
            "label": "激光波长"
          },
          {
            "value": "6.5 ns",
            "label": "激光脉冲半高全宽"
          },
          {
            "value": "3.5 MHz",
            "label": "换能器中心频率"
          }
        ],
        "figureIds": [
          "fig-1"
        ],
        "sourceNote": "原文第 803 页及图 1；学习笔记第 15–29 页。",
        "sourcePage": 2
      },
      {
        "id": "materials",
        "section": "研究对象与实验条件",
        "layout": "text",
        "title": "样本、对比来源与测量条件",
        "points": [
          {
            "label": "研究对象",
            "text": "麻醉状态下的成年 Sprague-Dawley 大鼠，体重约 350 g。论文给出的平均头皮厚度约为 0.6 mm，颅骨厚度约为 0.8 mm。"
          },
          {
            "label": "对比从哪里来",
            "text": "利用组织自身的光吸收，血红蛋白提供较强的血管对比；实验不依赖注射外源造影剂。"
          },
          {
            "label": "光激发与超声接收",
            "text": "入射能量面密度低于 10 mJ/cm²，估计皮肤温升低于 20 mK。换能器负六分贝相对带宽为 88%，柱面聚焦直径约为 1 mm。"
          },
          {
            "label": "如何核对成像结果",
            "text": "用组织等效仿体的线扩散函数评估分辨率；成像后拍摄解剖照片，并用皮层组织学切片核对空间位置。"
          }
        ],
        "takeaway": "约 1 mm 的柱面焦斑对应成像平面外的尺度；论文报告的约 0.2 mm 分辨率指成像平面内。",
        "sourceNote": "原文第 803–806 页；正文未报告动物样本量或仿体具体配方。",
        "sourcePage": 3
      },
      {
        "id": "reconstruction",
        "section": "研究方法 / 图像重建",
        "layout": "text",
        "title": "从时间波形到空间图像",
        "lead": "我们已经有各个探测位置的时间波形，现在要回答：图像中某个位置吸收了多少光？",
        "flow": [
          {
            "label": "选定像素",
            "text": "设定视野，并给出待重建位置的坐标。"
          },
          {
            "label": "计算到达时间",
            "text": "由像素到探测器的距离和假定声速求得。"
          },
          {
            "label": "处理时间波形",
            "text": "在该时刻读取信号的时间导数，并按公式 1 加权。"
          },
          {
            "label": "汇总多个角度",
            "text": "累加环形扫描各位置的贡献，再逐个处理其余像素。"
          }
        ],
        "relation": "到达时间 = 声源到探测器的距离 ÷ 声速",
        "takeaway": "这里是声源到探测器的单程传播。像素坐标由重建网格预先设定，测量数据决定填入各像素的数值。",
        "sourceNote": "原文第 803–804 页，公式 1；学习笔记第 29–37、80–91 页。",
        "sourcePage": 2,
        "paragraphs": [
          "先在图像中选一个候选位置。声速已知时，它到探测器的距离决定声波何时到达。重建就在相应时刻读取波形，经原文公式 1 的处理后，把不同探测角度的贡献汇总到这个位置。"
        ]
      },
      {
        "id": "structural-imaging",
        "section": "创新点 01 / 结构成像",
        "layout": "wide",
        "title": "透过头皮和颅骨看脑结构",
        "lead": "关键困难是光散射造成定位模糊；作者把吸收对比与声学定位整合到同一套系统中。",
        "points": [
          {
            "label": "具体改变了什么",
            "text": "宽区域光照产生吸收对比，环周超声接收提供多角度信息，再通过断层重建定位脑表层结构，无需打开颅窗。"
          },
          {
            "label": "图中证据在哪里",
            "text": "左侧 PAT 图像中的血管分支和主要结构，与右侧成像后取得的解剖照片相对应。"
          }
        ],
        "metrics": [
          {
            "value": "2.3–7.9",
            "label": "血管相对脑实质的吸收对比"
          }
        ],
        "figureIds": [
          "fig-2"
        ],
        "takeaway": "这项结果证明了该大鼠实验条件下的结构成像能力。局部光能分布和超声探测带宽仍会影响图像，不能把每个亮度值直接当成血红蛋白浓度。",
        "sourceNote": "原文第 804 页，图 2；学习笔记第 37–43 页。",
        "sourcePage": 2
      },
      {
        "id": "lesion",
        "section": "实验结果 / 损伤定位",
        "layout": "wide",
        "title": "能否定位皮层损伤",
        "lead": "正常结构能够显示之后，研究者进一步检验：异常吸收区域能否被定位？",
        "paragraphs": [
          "PAT 在右侧皮层显示了浅表损伤。随后拍摄的解剖照片用于核对损伤的位置和形状。"
        ],
        "metrics": [
          {
            "value": "1 × 4 mm",
            "label": "损伤的大致尺寸"
          },
          {
            "value": "1.7–5.2",
            "label": "损伤相对背景的吸收对比"
          }
        ],
        "figureIds": [
          "fig-3"
        ],
        "takeaway": "损伤由针穿过头皮和颅骨造成。成像时无需打开颅窗，但造模本身有创；这项实验也不能直接证明对某种疾病具有特异诊断能力。",
        "sourceNote": "原文第 804–805 页、图 3 及方法部分；学习笔记第 43–45 页。",
        "sourcePage": 3
      },
      {
        "id": "functional-mapping",
        "section": "创新点 02 / 功能成像",
        "layout": "wide",
        "title": "把刺激引起的变化分离出来",
        "lead": "静态血管图只能显示结构。要看刺激造成了什么变化，作者用刺激状态图像减去静息状态图像。",
        "points": [
          {
            "label": "实验怎样比较",
            "text": "分别以 10 Hz 刺激左侧和右侧胡须，将各自得到的 PAT 图像与无刺激状态比较。"
          },
          {
            "label": "结果如何支持方法",
            "text": "刺激侧改变时，响应也转移到对侧半球，并沿血管分布，支持其与刺激引起的血流动力学变化有关。"
          }
        ],
        "figureIds": [
          "fig-4b",
          "fig-4c"
        ],
        "relation": "功能差分图 = 刺激状态 PAT 图 − 静息状态 PAT 图",
        "sourceNote": "原文第 804–806 页，图 4b–c。10 Hz 指胡须刺激频率。",
        "sourcePage": 3
      },
      {
        "id": "functional-validation",
        "section": "实验结果 / 功能信号的含义",
        "layout": "split",
        "title": "功能图究竟测到了什么",
        "lead": "测到的是与血流动力学变化相关的光吸收变化。",
        "points": [
          {
            "label": "为什么与血液变化有关",
            "text": "在 532 nm 处，氧合与脱氧血红蛋白的消光系数相近。作者主要把信号增强解释为血容量或血流增加所致。"
          },
          {
            "label": "如何核对响应的位置",
            "text": "解剖定位和皮层第四层的桶状皮层切片支持响应位置。响应可沿血管传播，因此范围会超出桶状皮层。"
          }
        ],
        "metrics": [
          {
            "value": "最高 8%",
            "label": "大血管的相对吸收变化"
          }
        ],
        "figureIds": [
          "fig-4de"
        ],
        "takeaway": "8% 指相对吸收变化；它不等于神经放电变化、绝对血流速度或血氧饱和度。",
        "sourceNote": "原文第 804–806 页，图 4d–e；学习笔记第 53–59 页。",
        "sourcePage": 3
      },
      {
        "id": "resolution",
        "section": "关键指标辨析",
        "layout": "text",
        "title": "像素间距不等于空间分辨率",
        "lead": "图像网格可以划得很细，但细结构仍可能被系统模糊。采样间距和真实分辨能力是两个问题。",
        "metrics": [
          {
            "value": "40 μm",
            "label": "图 2 的像素间距：40 mm ÷ 1,000"
          },
          {
            "value": "≈200 μm",
            "label": "测得的平面内分辨率"
          },
          {
            "value": "40–360 μm",
            "label": "可见血管的直径，取自参照照片测量"
          }
        ],
        "points": [
          {
            "label": "分辨率怎样评估",
            "text": "作者使用组织等效仿体的线扩散函数：理想窄线在重建图像中会展宽，展宽反映系统的空间模糊。"
          },
          {
            "label": "为什么还能看见更细的血管",
            "text": "小于分辨率的高对比血管仍可能被检测到，但图像中的宽度会大于真实直径。能看见，并不代表能准确测量其大小。"
          }
        ],
        "takeaway": "正文报告约 0.2 mm 的分辨率，但未提供标定曲线、靶标尺寸或半高全宽计算，无法据此独立复核标定过程。",
        "sourceNote": "原文第 804 页；学习笔记第 40–43、92–101 页。",
        "sourcePage": 2
      },
      {
        "id": "speed-and-limits",
        "section": "局限与后续方向",
        "layout": "text",
        "title": "环形扫描的时间代价",
        "lead": "单探测器必须依次采集不同角度。功能图因此依赖稳定的定位，以及多次刺激下可重复的响应。",
        "flow": [
          {
            "label": "240 个位置",
            "text": "完整扫描 360°，角度步长为 1.5°。"
          },
          {
            "label": "每个位置约 4 s",
            "text": "在该位置采集并平均信号。"
          },
          {
            "label": "一幅图约 16 min",
            "text": "240 × 4 s = 960 s，与文中估计一致。"
          }
        ],
        "points": [],
        "sourceNote": "原文第 805 页，讨论部分；采集时间由文中角度步长与单点时间核算。",
        "sourcePage": 3,
        "paragraphs": [
          "每个位置的胡须刺激持续 4.5 s；从刺激开始后 0.5 s 到 4.5 s 采集信号。"
        ],
        "takeaway": "作者提出用阵列和更快的激光器加速采集，并通过多波长测量进一步获得氧合相关信息；这些属于后续方向，本文演示仍采用单波长。"
      },
      {
        "id": "conclusions",
        "section": "结论",
        "layout": "text",
        "title": "这篇论文确立了什么",
        "lead": "核心贡献是在活体大鼠中，整合展示了透过头皮和颅骨的脑结构与功能光声成像。",
        "points": [
          {
            "label": "结构层面的证据",
            "text": "利用内源性吸收对比显示正常脑结构与人工诱导的浅表损伤，并与成像后的解剖照片对应。"
          },
          {
            "label": "功能层面的证据",
            "text": "比较刺激与静息状态，得到具有左右侧对应关系的血管响应；解剖与组织学结果支持其空间定位。"
          },
          {
            "label": "方法上的意义",
            "text": "把宽区域光激发、多角度声学采集与重建串联起来，将光吸收转化为空间图像，为功能 PACT 提供实验基础。"
          },
          {
            "label": "结论的适用边界",
            "text": "系统采集慢、采用单波长，反映的是间接血流动力学指标。实时成像和人脑成像在本文中仍是未来方向。"
          }
        ],
        "takeaway": "气体刺激响应与深部脑图像另见补充图 1–2。本次提供的四页正文未包含这两张图，也未给出深部成像的定量性能评估。",
        "sourceNote": "原文第 803–806 页；学习笔记第 65–79、102 页。",
        "sourcePage": 3
      },
      {
        "id": "sources",
        "section": "资料与参考来源",
        "layout": "references",
        "title": "原始文件与参考资料",
        "lead": "论文原文：4 页。完整文献学习笔记：102 页。",
        "paragraphs": [],
        "sourceNote": "科学内容依据所提供的论文与学习笔记；团队背景依据机构官方页面。"
      }
    ],
    "language": "zh-CN"
  }
}
---
