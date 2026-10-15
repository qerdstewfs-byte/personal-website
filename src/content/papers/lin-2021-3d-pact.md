---
{
  "slug": "lin-2021-3d-pact",
  "title": "High-speed three-dimensional photoacoustic computed tomography for preclinical research and clinical translation",
  "category": "pact",
  "status": "published",
  "summary": "Four arc arrays and 1,024-channel parallel acquisition combine with rotational scanning, proximal amplification, geometric calibration and dual-speed-of-sound reconstruction for high-speed 3D PACT of rat brain and healthy human breast.",
  "journal": "Nature Communications",
  "year": 2021,
  "authors": [
    "Li Lin",
    "Peng Hu",
    "Xin Tong",
    "Shuai Na",
    "Rui Cao",
    "Xiaoyun Yuan",
    "David C. Garrett",
    "Junhui Shi",
    "Konstantin Maslov",
    "Lihong V. Wang"
  ],
  "doi": "10.1038/s41467-021-21232-1",
  "tags": [
    "3D-PACT",
    "Hemispherical detection",
    "1024 channels",
    "System integration",
    "Reading notes"
  ],
  "updated": "2026-10-13",
  "downloads": {
    "pdf": {
      "url": "/library/lin-2021-3d-pact/original.pdf",
      "label": "lin-2021-3d-pact-original.pdf",
      "size": "5.65 MB"
    },
    "notes": {
      "url": "/library/lin-2021-3d-pact/reading-notes.pdf",
      "label": "lin-2021-3d-pact-reading-notes.pdf",
      "size": "5.76 MB"
    }
  },
  "references": [
    {
      "title": "Lin 等，2021，Nature Communications。DOI: 10.1038/s41467-021-21232-1",
      "url": "https://doi.org/10.1038/s41467-021-21232-1"
    },
    {
      "title": "CaltechAUTHORS：本文作者、所属机构与正式文献记录",
      "url": "https://authors.library.caltech.edu/records/mv4tv-ffm19"
    },
    {
      "title": "Caltech Optical Imaging Laboratory：研究方向",
      "url": "https://coilab.caltech.edu/research"
    }
  ],
  "team": {
    "name": "Caltech Optical Imaging Laboratory（COIL）",
    "institution": "美国加州理工学院医学工程系",
    "mainWork": [
      "论文来自加州理工学院光学成像实验室，Li Lin、Peng Hu、Xin Tong、Shuai Na 为共同第一作者，Lihong V. Wang 为通讯作者。",
      "实验室官方介绍以生物光子断层成像为研究主线，结合光学吸收对比与超声空间定位，研究功能成像及相关生物医学应用。本篇聚焦多尺度三维光声平台的系统集成。"
    ],
    "sources": [
      {
        "title": "Lin 等，2021，Nature Communications。DOI: 10.1038/s41467-021-21232-1",
        "url": "https://doi.org/10.1038/s41467-021-21232-1"
      },
      {
        "title": "CaltechAUTHORS：本文作者、所属机构与正式文献记录",
        "url": "https://authors.library.caltech.edu/records/mv4tv-ffm19"
      },
      {
        "title": "Caltech Optical Imaging Laboratory：研究方向",
        "url": "https://coilab.caltech.edu/research"
      }
    ]
  },
  "problem": "要从大鼠脑走向人体乳腺，不能只提高某一个指标。小而稀疏的球面阵列可快速获得局部图，却可能在较大视野内采样不足；慢扫描虽补足位置，又容易产生运动伪影。深部声压还要经过光和声传播损失，弱信号可能在电缆及采集过程中被噪声掩盖。本文把照明、接收立体角、空间采样、前端放大、几何标定和传播模型联合设计，试图同时改善速度、深度和三维图像质量。",
  "materials": [
    {
      "title": "半球面上的四条弧阵列",
      "text": "四条弧形阵列每条 256 阵元，共 1024 阵元，安装于半球面并随支架旋转 90° 以补足采样。中心频率 2.25 MHz，单程相对带宽大于 98%；名义半径 130 mm。大接收立体角帮助减少有限视角造成的信息缺失。",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "照明、耦合与前端电子学",
      "text": "采用 1064 nm、10 Hz、8–12 ns 脉冲激光，扩散器扩大光束，承托杯轻压组织，重水用于主要声学耦合区域。近阵列 1024 路前置放大先增强弱信号，再送入四个 256 路采集模块。",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "实验对象与条件",
      "text": "系统用点吸收体、叶脉骨架和仿体标定，并用于大鼠脑结构与功能以及一名健康女性双侧乳腺成像。脑结构与功能实验的头皮、颅骨处理条件不同，必须随结果注明；人体展示并非乳腺癌病例队列。",
      "figureIds": [
        "fig-2",
        "fig-4"
      ]
    }
  ],
  "methods": [
    {
      "title": "采样与机械扫描协同",
      "text": "每个激光脉冲并行得到 1024 条波形，再旋转阵列采集其他角度。功能模式每体积 2 s，脑结构单次 5 s，乳腺 10 s。较长扫描提供更多位置、支持较大视野；10 Hz 激发频率不等于 10 个三维体积每秒。",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "先校准接收几何",
      "text": "制造误差使真实阵元位置偏离名义圆弧。用多个位置的点声源测得到达时间，联合更新声速、点源坐标与阵元径向位置，使几何预测距离和实测传播时间一致。标定的目的在于让不同接收波形能正确回到同一个声源位置。",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "双声速反投影",
      "text": "采用通用反投影（universal back-projection，UBP）恢复三维初始压力。先作单声速初始图，提取组织边界并拟合半椭球，再分别为组织和耦合液设置声速，修正到达时间。它缓解两种介质差异，但不是完整求解所有声学非均匀性。",
      "figureIds": []
    },
    {
      "title": "显示处理与数据解释",
      "text": "空间插值和位置相关低通处理欠采样伪影；重建体积依次做深度补偿、稀疏四维变换域协同去噪（BM4D）及 Frangi 管状增强。最终显示混合原始深度补偿图和归一化增强图，不能把显示强度直接等同于原始定量压力。",
      "figureIds": []
    }
  ],
  "innovations": [
    {
      "title": "并行接收与可扩展半球采样",
      "before": "稀疏探测可很快，但可充分分辨的视野有限；增加扫描又延长采集。",
      "change": "1024 路并行接收配合四弧旋转，形成密集的半球测量位置。",
      "why": "接近半球的接收立体角减少方向缺失；旋转增加空间采样点，按目标视野选择采集时间。",
      "evidence": "点吸收体测得横向约 390 μm、轴向约 370 μm；功能、脑结构和乳腺分别使用 2、5、10 s 扫描。",
      "tradeoff": "仍需机械运动和大量电子通道；视野外空间采样不足会降低横向分辨率。",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "深部信号与读出链联合设计",
      "before": "深部信号已弱，若在长电缆后才放大，噪声可能先损害可用信号。",
      "change": "1064 nm 照明、2.25 MHz 宽带接收和一一对应的近端低噪声放大共同工作。",
      "why": "光学与声学传播条件帮助获取深部信号，近端放大减少后续传输噪声对弱信号的影响。",
      "evidence": "图 2 展示约 10 mm 深的大鼠全脑血管；图 4 在一次 10 s 屏气中显示健康人乳腺约 4 cm 深的血管。",
      "tradeoff": "不能据此宣称组织内光通量均匀或所有深度同样清晰；单波长仍限制成分分离。",
      "figureIds": [
        "fig-2",
        "fig-4"
      ]
    },
    {
      "title": "标定与传播模型支撑系统性能",
      "before": "名义阵元位置误差或声速模型偏差会使多通道回投的位置错开。",
      "change": "点声源几何标定与组织/耦合液双声速 UBP 串入处理流程。",
      "why": "前者校正测量几何，后者修正跨介质的传播时间，让多角度贡献更一致。",
      "evidence": "原文几何标定实验和图 1d 的叶脉图体现校准后的细节；方法部分给出双声速流程。",
      "tradeoff": "使用简化几何与介质模型；不是首次提出 UBP、Jacobi 迭代或所有后处理方法，主要贡献是系统能力整合。",
      "figureIds": [
        "fig-1"
      ]
    }
  ],
  "results": [
    {
      "title": "大鼠脑结构",
      "text": "图 2 展示约 10 mm 深全脑血管。该展示采用八次 5 s 扫描平均，并磨薄颅骨上部以减弱声学畸变；单次 5 s 图另见论文补充说明。不能把展示图称为未处理颅骨下的单次 2 s 结构图。",
      "figureIds": [
        "fig-2"
      ]
    },
    {
      "title": "大鼠功能成像",
      "text": "功能模式每体积 2 s，颅骨保留但顶部头皮已去除。实验记录低氧、麻醉变化和肢体刺激相关的光声幅值，并分析区域时间序列相关性。幅值受氧合、血容量及其他因素共同影响，不是独立测得的血氧、血流或神经放电。",
      "figureIds": [
        "fig-3af",
        "fig-3gh"
      ]
    },
    {
      "title": "人体乳腺与仿体边界",
      "text": "一名 31 岁健康女性双侧乳腺在轻压和一次 10 s 屏气条件下成像，最深约 4 cm；不同深度图是 1 cm 厚区域的最大振幅投影。另一个仿体在 2 cm 深度、给定吸收对比下检出 1 mm 目标，不能拼接为人体 4 cm 深处检出 1 mm 癌。",
      "figureIds": [
        "fig-4"
      ]
    },
    {
      "title": "分辨率与网格",
      "text": "图像计算体素为 0.13 mm 边长，点目标测试得到的系统分辨率约 0.37–0.39 mm；130 μm 网格并不意味着 130 μm 分辨率。采集 2–10 s 也不自动代表全部重建显示在同样时间内完成。",
      "figureIds": []
    }
  ],
  "conclusions": [
    "本篇展示的是系统协同设计：并行接收、旋转空间采样、深部照明、近端放大和校正重建共同提升三维能力。",
    "同一平台支持大鼠全脑结构/功能和健康人乳腺血管成像，说明其尺度适应性；各实验条件需要分别保留。",
    "主要限制包括单波长、机械扫描、有限空间采样、近似传播模型和显示处理偏差。",
    "原文 10 页与完整学习笔记 31 页原样保留。核心重建代码按论文声明为专有代码，不能仅凭数据目录名含 Codes 就称整个系统开源。"
  ],
  "figures": [
    {
      "id": "fig-1",
      "src": "/library/lin-2021-3d-pact/fig-1.webp",
      "width": 1530,
      "height": 936,
      "alt": "四弧半球阵列、旋转机构、近端前放和采集模块及叶脉标定结果",
      "caption": "先看整体与剖面连接关系，再看实物与叶脉结果；阵列、前端和采集随旋转模块协同工作。",
      "attribution": "Lin 等，2021，Nature Communications，图 1（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41467-021-21232-1"
    },
    {
      "id": "fig-2",
      "src": "/library/lin-2021-3d-pact/fig-2.webp",
      "width": 1479,
      "height": 696,
      "alt": "大鼠全脑三维血管图与多个方向的投影",
      "caption": "该展示采用颅骨磨薄和八次 5 s 平均；局部投影用于辨认深部血管结构。",
      "attribution": "Lin 等，2021，Nature Communications，图 2（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41467-021-21232-1"
    },
    {
      "id": "fig-3",
      "src": "/library/lin-2021-3d-pact/fig-3.webp",
      "width": 1254,
      "height": 1854,
      "alt": "低氧、麻醉变化、区域相关性和肢体刺激的大鼠脑功能结果",
      "caption": "不同面板共用光声幅值时间序列，但对应不同实验任务；不能解释成直接神经活动图。",
      "attribution": "Lin 等，2021，Nature Communications，图 3（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41467-021-21232-1"
    },
    {
      "id": "fig-3af",
      "src": "/library/lin-2021-3d-pact/fig-3af.webp",
      "width": 1254,
      "height": 1311,
      "alt": "低氧挑战与由深麻醉到浅麻醉时的区域光声幅值",
      "caption": "左侧比较吸入空气与氮气，右侧记录麻醉变化；曲线反映混合生理因素的幅值变化。",
      "attribution": "Lin 等，2021，Nature Communications，图 3a–f（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41467-021-21232-1"
    },
    {
      "id": "fig-3gh",
      "src": "/library/lin-2021-3d-pact/fig-3gh.webp",
      "width": 1152,
      "height": 540,
      "alt": "脑区时间序列相关矩阵与前肢刺激响应",
      "caption": "g 表示区域信号相关，h 比较刺激相关响应；相关性不是血管或神经连接的直接测量。",
      "attribution": "Lin 等，2021，Nature Communications，图 3g–h（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41467-021-21232-1"
    },
    {
      "id": "fig-4",
      "src": "/library/lin-2021-3d-pact/fig-4.webp",
      "width": 1539,
      "height": 783,
      "alt": "健康女性左右乳腺的三维血管图和不同深度区域投影",
      "caption": "a、c 对应双侧乳腺，b、d 为 1 cm 厚区域的最大振幅投影，最深区域约 3–4 cm。",
      "attribution": "Lin 等，2021，Nature Communications，图 4（原图裁剪，未改动内容）。",
      "source": "https://doi.org/10.1038/s41467-021-21232-1"
    }
  ],
  "presentation": {
    "title": "Lin 等（2021）文献汇报",
    "language": "zh-CN",
    "slides": [
      {
        "id": "overview",
        "section": "文献汇报 / LIN 等，2021",
        "title": "高速三维 PACT 的系统协同",
        "sourceNote": "原文第 1–7 页，图 1、4。",
        "layout": "cover",
        "lead": "当目标从大鼠脑扩大到人体乳腺，怎样同时保住速度、深度、视野与三维图像质量？",
        "figureIds": [
          "fig-4"
        ],
        "metrics": [
          {
            "value": "1024",
            "label": "并行接收通道"
          },
          {
            "value": "10 s",
            "label": "健康人乳腺扫描"
          }
        ],
        "sourcePage": 7
      },
      {
        "id": "publication-team",
        "section": "期刊与研究团队",
        "title": "论文与团队背景",
        "sourceNote": "原文第 1 页；Caltech 机构记录与实验室官网。",
        "layout": "text",
        "lead": "Nature Communications · 12: 882 · 2021 · DOI: 10.1038/s41467-021-21232-1",
        "points": [
          {
            "label": "研究团队",
            "text": "加州理工学院光学成像实验室；Li Lin、Peng Hu、Xin Tong、Shuai Na 为共同第一作者，Lihong V. Wang 为通讯作者。"
          },
          {
            "label": "本文定位",
            "text": "工程系统研究：用一套平台同时展示临床前与人体尺度的三维成像。"
          },
          {
            "label": "实验室方向",
            "text": "结合光学吸收对比与超声定位，发展生物光子断层与功能成像方法。"
          }
        ],
        "sources": [
          {
            "title": "CaltechAUTHORS：本文作者、所属机构与正式文献记录",
            "url": "https://authors.library.caltech.edu/records/mv4tv-ffm19"
          },
          {
            "title": "Caltech Optical Imaging Laboratory：研究方向",
            "url": "https://coilab.caltech.edu/research"
          }
        ],
        "sourcePage": 1
      },
      {
        "id": "problem",
        "section": "研究场景",
        "title": "目标变大之后缺少什么",
        "sourceNote": "原文第 2 页；学习笔记第 5–6 页。",
        "layout": "text",
        "lead": "能拍出一个小区域，并不意味着能用相同速度看清更大的三维器官。",
        "points": [
          {
            "label": "空间覆盖",
            "text": "阵元稀疏或视角不足，容易漏掉结构方向，视野外出现采样伪影。"
          },
          {
            "label": "时间与运动",
            "text": "加密扫描可以补位置，但更长时间会引入运动错位。"
          },
          {
            "label": "深部信号",
            "text": "光与声传播衰减后，弱信号还必须经过前端、电缆和采集。"
          }
        ],
        "takeaway": "本篇把几何、光学、声学与电子学放在同一套系统中处理。",
        "sourcePage": 2
      },
      {
        "id": "system",
        "section": "系统构型",
        "title": "四条弧怎样覆盖半球",
        "sourceNote": "原文第 2–3、7 页，图 1。",
        "layout": "wide",
        "lead": "每条弧 256 阵元，四条共 1024 阵元；整体旋转 90°，把离散弧补成密集测量面。",
        "figureIds": [
          "fig-1"
        ],
        "paragraphs": [
          "声学中心频率 2.25 MHz，单程相对带宽大于 98%。半球接收提供较大立体角，旋转增加空间测量位置，两者承担不同任务。"
        ],
        "sourcePage": 3
      },
      {
        "id": "readout",
        "section": "前端与后端读出",
        "title": "先保护弱信号，再传输",
        "sourceNote": "原文第 7–8 页；学习笔记第 9–10 页。",
        "layout": "text",
        "lead": "换能器已经收到深部声波，接下来要避免微弱电信号在传输中被噪声掩盖。",
        "flow": [
          {
            "label": "换能器",
            "text": "1024 阵元并行接收声压。"
          },
          {
            "label": "近端前放",
            "text": "阵列附近 51 dB 前置放大。"
          },
          {
            "label": "多通道采集",
            "text": "四组 256 通道，最高 40 MHz 时间采样。"
          },
          {
            "label": "传输与同步",
            "text": "数字化后写入存储，激光触发协调采集与旋转。"
          }
        ],
        "takeaway": "提高时间采样率不能替代更多接收位置；电子学同步也不能替代正确几何。",
        "sourcePage": 7
      },
      {
        "id": "scan-budget",
        "section": "速度与空间采样",
        "title": "三个时间对应三个任务",
        "sourceNote": "原文第 3、7 页；学习笔记第 10、25 页。",
        "layout": "text",
        "lead": "激光以 10 Hz 激发；一个体积需要多个角度，因此不能把激发频率当成体积率。",
        "metrics": [
          {
            "value": "2 s",
            "label": "功能模式，每秒 0.5 体积"
          },
          {
            "value": "5 s",
            "label": "脑结构单次扫描"
          },
          {
            "value": "10 s",
            "label": "乳腺较大视野扫描"
          }
        ],
        "paragraphs": [
          "较长扫描在相同激发频率下收集更多空间位置。视野、扫描速度和可分辨细节存在关联；不能从不同模式中各取最好数字合成一个配置。"
        ],
        "sourcePage": 7
      },
      {
        "id": "calibration",
        "section": "系统标定",
        "title": "为什么名义位置不够用",
        "sourceNote": "原文第 3、8 页；学习笔记第 12–14 页。",
        "layout": "text",
        "lead": "重建要计算每个像素到阵元的传播时间。阵元位置有误，不同通道就会把同一声源放在不同地方。",
        "flow": [
          {
            "label": "已知点状声源",
            "text": "把小吸收体放到多个位置。"
          },
          {
            "label": "测到达时间",
            "text": "记录各阵元接收波形。"
          },
          {
            "label": "联合校正",
            "text": "迭代更新声速、点源与径向阵元位置。"
          },
          {
            "label": "再次重建",
            "text": "检查结构是否更一致、更清晰。"
          }
        ],
        "takeaway": "校准是整套测量几何的修正，不是把最终模糊图直接锐化。",
        "sourcePage": 8
      },
      {
        "id": "reconstruction",
        "section": "传播模型与重建",
        "title": "同一条路径经过两种介质",
        "sourceNote": "原文第 8 页；学习笔记第 14–16 页。",
        "layout": "text",
        "lead": "声波先经过组织，再经过耦合液；两段的声速不同，单一声速会错估到达时间。",
        "points": [
          {
            "label": "先获得初始图",
            "text": "单声速 UBP 得到初步结构，提取组织外表面。"
          },
          {
            "label": "用边界划分路径",
            "text": "把表面拟合为半椭球，区分组织与耦合区域。"
          },
          {
            "label": "再作双声速回投",
            "text": "按两段传播时间重新计算，将波形贡献放回三维空间。"
          }
        ],
        "takeaway": "这是两区域近似，不能自动消除折射、衰减或所有复杂非均匀性。完整推导保留在笔记。",
        "sourcePage": 8
      },
      {
        "id": "resolution",
        "section": "性能标定",
        "title": "体素边长不是分辨率",
        "sourceNote": "原文第 3、8 页；学习笔记第 17、25 页。",
        "layout": "text",
        "lead": "先选计算网格，再问一个真实点目标在重建里展宽到多大。",
        "metrics": [
          {
            "value": "130 μm",
            "label": "计算体素边长"
          },
          {
            "value": "390 μm",
            "label": "横向点目标测试分辨率"
          },
          {
            "value": "370 μm",
            "label": "轴向点目标测试分辨率"
          }
        ],
        "paragraphs": [
          "作者用 50 μm 铝颗粒测量系统展宽。更细的网格使图像计算更密，并不新增同等细度的测量信息；视野外的空间采样不足也会降低清晰度。"
        ],
        "sourcePage": 3
      },
      {
        "id": "brain-anatomy",
        "section": "动物结构实验",
        "title": "全脑图像的实验条件",
        "sourceNote": "原文第 3–4、8 页，图 2；学习笔记第 16–18 页。",
        "layout": "wide",
        "lead": "约 10 mm 深的脑血管图展示系统覆盖，但必须把头部处理和平均条件一起读。",
        "figureIds": [
          "fig-2"
        ],
        "points": [
          {
            "label": "图 2 的采集",
            "text": "八次 5 s 扫描平均；颅骨上部经过磨薄。"
          },
          {
            "label": "与功能实验区别",
            "text": "功能保留颅骨，但顶部头皮去除；不能概括为所有实验都完整保留头皮和颅骨。"
          }
        ],
        "takeaway": "平均降低随机噪声，也依赖样本稳定与多次数据对齐。",
        "sourcePage": 4
      },
      {
        "id": "brain-function",
        "section": "动物功能实验",
        "title": "幅值变化由什么共同决定",
        "sourceNote": "原文第 4–6 页，图 3a–f；学习笔记第 18–21 页。",
        "layout": "wide",
        "lead": "同一套三维血管数据随时间变化，可以观察低氧与麻醉过程中的血流动力学响应。",
        "figureIds": [
          "fig-3af"
        ],
        "paragraphs": [
          "1064 nm 下的光声幅值受氧合血红蛋白、血容量及照明等因素影响。选定区域内血管直径变化也会改变平均幅值。"
        ],
        "takeaway": "图中并非分别、直接测得血氧、血流、血容量与神经放电。",
        "sourcePage": 5
      },
      {
        "id": "connectivity",
        "section": "动物功能实验",
        "title": "区域相关不等于直接连接",
        "sourceNote": "原文第 4–6 页，图 3g–h；学习笔记第 20–21 页。",
        "layout": "wide",
        "lead": "作者进一步比较脑区信号的同步波动，并检查前肢刺激时相应区域的响应。",
        "figureIds": [
          "fig-3gh"
        ],
        "points": [
          {
            "label": "相关矩阵",
            "text": "比较不同区域光声时间序列的相关性。"
          },
          {
            "label": "刺激响应",
            "text": "将已知刺激时序与对应区域的血流动力学变化联系起来。"
          }
        ],
        "takeaway": "它支持功能相关的血流动力学观察，不能单凭相关矩阵确认神经或血管连接。",
        "sourcePage": 5
      },
      {
        "id": "human-breast",
        "section": "人体成像",
        "title": "一次屏气观察深部血管",
        "sourceNote": "原文第 6–7 页，图 4；学习笔记第 21–22 页。",
        "layout": "wide",
        "lead": "一名健康女性俯卧，乳腺受承托杯轻压，阵列在一次 10 s 屏气中扫描。",
        "figureIds": [
          "fig-4"
        ],
        "metrics": [
          {
            "value": "≈4 cm",
            "label": "文中可见血管深度"
          }
        ],
        "takeaway": "左右两侧来自同一受试者；深度图为 1 cm 厚区域最大振幅投影，并非无限薄的断面。",
        "sourcePage": 7
      },
      {
        "id": "phantom-boundary",
        "section": "证据边界",
        "title": "仿体检出不能替代人体诊断",
        "sourceNote": "原文第 6 页；学习笔记第 22 页。",
        "layout": "text",
        "lead": "人体成像与小目标仿体测试回答的是两个不同问题。",
        "points": [
          {
            "label": "人体展示",
            "text": "健康志愿者约 4 cm 深血管可见，证明人体成像可行性。"
          },
          {
            "label": "仿体测试",
            "text": "在 2 cm 深度、给定吸收比 2.1 的条件下，可检出直径 1 mm 模拟目标。"
          },
          {
            "label": "不能拼接的结论",
            "text": "这些数据不证明已在人乳腺 4 cm 深处检出 1 mm 癌，也不提供临床敏感度与特异度。"
          }
        ],
        "sourcePage": 6
      },
      {
        "id": "processing",
        "section": "图像处理与解释",
        "title": "显示变清楚之后改变了什么",
        "sourceNote": "原文第 8 页；学习笔记第 23–24 页。",
        "layout": "text",
        "lead": "重建之后的去噪与血管增强会改变最终显示，读图时要保留这条处理链。",
        "flow": [
          {
            "label": "深度补偿",
            "text": "放大深部信号，也同时放大噪声。"
          },
          {
            "label": "BM4D 去噪",
            "text": "利用相似三维小块抑制部分噪声。"
          },
          {
            "label": "Frangi 增强",
            "text": "按局部管状形态突出血管候选。"
          },
          {
            "label": "混合显示",
            "text": "0.8 倍深度补偿图与 0.2 倍归一化增强图。"
          }
        ],
        "takeaway": "更亮、更干净的最终图不等同于重新测得更强的原始压力或更高的绝对血红蛋白浓度。",
        "sourcePage": 8
      },
      {
        "id": "conclusions",
        "section": "结论与系统启示",
        "title": "性能来自整条链共同工作",
        "sourceNote": "原文第 6–9 页；学习笔记第 24–25、31 页。",
        "layout": "text",
        "lead": "主要贡献是高通道、采样几何、读出与校正模型组合成了可用于不同尺度的三维系统。",
        "points": [
          {
            "label": "硬件与几何",
            "text": "照明、半球接收和旋转采样决定能测到什么。"
          },
          {
            "label": "读出与标定",
            "text": "近端低噪声放大、同步和几何校准决定测量是否可靠。"
          },
          {
            "label": "模型与显示",
            "text": "双声速与后处理改善图像，但需说明假设和显示偏差。"
          },
          {
            "label": "保留边界",
            "text": "单波长、机械扫描和探索性人体示范仍限制功能量化与临床结论。"
          }
        ],
        "takeaway": "作者提出的更高激光重复率、多波长和更快电机属于升级方向，不能当作本文实测性能。",
        "sourcePage": 7
      },
      {
        "id": "sources",
        "section": "资料与参考来源",
        "title": "原始文件与完整学习笔记",
        "sourceNote": "两份 PDF 均来自指定 Zotero 条目，按 SHA-256 核对；未修改上传原文件。",
        "layout": "references",
        "lead": "论文原文 10 页；个人学习笔记 31 页。",
        "paragraphs": [
          "完整几何标定、双声速、反投影和后处理教学保留在笔记中。原文指出核心重建代码为专有代码，公开资料边界按论文说明。"
        ]
      }
    ]
  }
}
---
