# 睿睿

个人学术与技术主页，用于展示学习方向、项目实践、科研兴趣、简历入口和后续笔记内容。当前项目已经完成 Astro 基础架构、Tailwind CSS 样式接入、页面外壳和主要页面内容，适合部署为静态网站。

## 技术栈

- Astro
- Tailwind CSS
- TypeScript
- Vite
- npm

## 本地运行

首次拉取项目后安装依赖：

```bash
npm install
```

启动本地开发服务：

```bash
npm run dev
```

默认本地地址通常为 `http://localhost:4321`，以终端输出为准。

## 构建方式

```bash
npm run build
```

当前构建脚本会先执行 `astro check`，再执行 `astro build`。静态产物输出到 `dist/`。

本地预览生产构建：

```bash
npm run preview
```

## 项目目录结构

```text
.
├── public/                 # 静态资源，构建时按原路径复制
├── src/
│   ├── components/         # 页面组件
│   ├── layouts/            # 页面布局
│   ├── pages/              # Astro 路由页面
│   └── styles/             # 全局样式
├── docs/
│   ├── deploy.md           # GitHub / Vercel / 域名部署说明
│   ├── roadmap.md          # 后期扩展路线
│   └── handoff/            # 阶段性交接文档
├── astro.config.mjs        # Astro 配置
├── tailwind.config.mjs     # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目脚本与依赖
```

## 部署方式

推荐部署到 Vercel：

- GitHub 托管源代码。
- Vercel 从 GitHub 导入项目。
- Framework Preset 选择 Astro 或让 Vercel 自动识别。
- Build Command 使用 `npm run build`。
- Output Directory 使用 `dist`。

详细步骤见 [docs/deploy.md](docs/deploy.md)。

## 后期计划

- 添加 Markdown 笔记系统。
- 添加项目详情页。
- 添加站内搜索。
- 添加中英文切换。
- 添加访问统计。
- 添加 AI 助手入口。
- 做国内访问优化。
- 接入 Cloudflare DNS 和基础防护。

详细路线见 [docs/roadmap.md](docs/roadmap.md)。
