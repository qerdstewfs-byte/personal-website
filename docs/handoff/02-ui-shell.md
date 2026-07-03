# UI Shell Handoff

## 使用了哪些插件或工具

- Figma: 工具可发现，但本次没有用户提供 Figma 文件或 planKey，因此未生成 Figma 设计稿；按需求直接实现简洁现代 UI。
- Browser: 可用。用于打开本地预览、检查桌面和手机视口、导航、暗色模式和控制台错误。
- Context7 MCP: 可用。查询了当前 Astro 与 Tailwind CSS 文档。
- Sites 插件: 未使用。

## 已实现的组件

- `src/layouts/Layout.astro`: 统一 HTML 页面结构，包含 `Header`、`main`、`Footer`，并导入全局样式。
- `src/layouts/BaseLayout.astro`: 保留为兼容包装，内部转发到新的 `Layout.astro`，避免现有页面立即修改 import。
- `src/components/Header.astro`: 响应式顶部导航，包含首页、项目、科研、学习记录、简历、关于我，并支持当前页面高亮。
- `src/components/Footer.astro`: 页脚包含网站名称、简短说明、GitHub 占位链接、Email 占位链接和版权信息。
- `src/components/SectionTitle.astro`: 通用模块标题组件，支持 eyebrow、标题和说明。
- `src/components/TechBadge.astro`: 通用技术标签组件。
- `src/components/ThemeToggle.astro`: 暗色模式切换按钮，使用本地存储记忆用户选择。
- `src/styles/global.css`: 全局颜色 token、布局外壳、导航、页脚、标题和标签组件样式。

## 设计风格说明

- 风格定位为简洁、现代、偏学术技术风格。
- 视觉语言以浅色背景、克制边框、低强度阴影、清晰导航和舒适留白为主。
- 使用系统字体栈，不依赖外部字体 CDN。
- 色彩以 slate/zinc 中性色为基础，使用 cyan 作为低调强调色。
- 卡片和按钮圆角控制在较小半径，避免过度装饰。

## 暗色模式实现方式

- Tailwind 使用 `dark:` 变体，`global.css` 中加入 `@custom-variant dark (&:where(.dark, .dark *));`。
- `Layout.astro` 在页面头部内联一段极小脚本，首次渲染前读取 `localStorage.theme`；没有用户选择时使用系统 `prefers-color-scheme`。
- `ThemeToggle.astro` 点击后切换 `document.documentElement` 上的 `.dark` class，并写入 `localStorage`。
- 颜色通过 CSS 变量集中定义，浅色和暗色只切换 token 值。

## 页面内容线程如何使用这些组件

- 现有页面仍可继续导入 `src/layouts/BaseLayout.astro`，它已经代理到新 UI 外壳。
- 新页面建议直接使用 `src/layouts/Layout.astro`：

```astro
---
import Layout from "../layouts/Layout.astro";
import SectionTitle from "../components/SectionTitle.astro";
import TechBadge from "../components/TechBadge.astro";
---

<Layout title="页面标题 | My Website">
  <section>
    <SectionTitle
      eyebrow="Section"
      title="模块标题"
      description="模块说明文字。"
    />
    <TechBadge label="Astro" />
  </section>
</Layout>
```

- 页面内容工程师可以只负责页面主体内容；Header、Footer、暗色模式和整体宽度由 Layout 统一提供。

## 当前存在的问题

- GitHub 与 Email 仍是占位链接，需要后续替换为真实公开链接。
- 网站名称仍使用 `My Website` 占位，后续可统一替换为真实姓名或站点名。
- 本次没有生成 Figma 文件，因为没有可直接使用的 Figma 文件上下文或 planKey。
- 预览验证使用构建后的 `dist` 静态服务完成；常规 `npm run dev` 在当前 PowerShell 后台启动环境中不稳定，但 `npm.cmd run build` 已成功通过。
- 工作区中页面内容文件已有其他线程改动，本次未回滚、未覆盖。

## 后续优化建议

- 替换站点名称、GitHub、Email、头像和简历 PDF。
- 页面内容稳定后，可给首页和项目页增加更具体的内容区块样式。
- 可加入基础 SEO 元信息组件，例如 Open Graph、canonical URL 和页面级 description。
- 可补充无障碍细节，例如移动导航展开后点击链接自动收起、Esc 关闭菜单。
- 如果后续提供 Figma 文件，可把当前 UI shell 同步为可编辑设计稿。

## 验证记录

- `npm.cmd run build`: 通过，`astro check` 结果为 0 errors、0 warnings、0 hints。
- Browser 桌面视口 `1280x720`: 导航项齐全、首页 active 正常、页脚存在、无横向溢出、控制台无 error。
- Browser 手机视口 `390x844`: 移动导航默认隐藏，菜单按钮可展开，无横向溢出。
- 暗色模式: 手机视口下点击切换后 `.dark` class、`data-theme="dark"` 和按钮 `aria-pressed="true"` 均正常。
- 导航跳转: 点击“项目”后进入 `/projects`，项目导航 active 正常，控制台无 error。
