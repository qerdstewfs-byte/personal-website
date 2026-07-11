# 睿睿

聚焦光声成像的个人主页，采用简洁的浅色视觉系统，保留首页、光声成像和关于我三个核心页面，适合部署为静态网站。

## 页面

- `/`：个人首页
- `/photoacoustic`：光声成像原理与当前关注
- `/about`：关于我

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

- 持续完善光声成像原理说明。
- 补充仿真、采样与重建方法的可视化内容。
- 添加中英文切换与访问体验优化。
