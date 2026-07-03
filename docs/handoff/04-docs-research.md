# Context7 文档研究交接

## 1. Context7 可用性

Context7 MCP 可用。本次已按要求先使用 `resolve-library-id`，再使用 `query-docs` 查询当前文档。

已选用的文档源：

- Astro：`/withastro/docs`，官方文档，高信誉。
- Tailwind CSS：`/tailwindlabs/tailwindcss.com`，官方文档，高信誉。
- Vercel：`/websites/vercel`，Vercel 文档，高信誉。

当前工作区 `C:\Users\25071\OneDrive\Desktop\website` 没有发现可见的 Astro 项目文件，也不是 Git 仓库。因此本交接只给出文档依据和保守建议，不判断现有配置是否冲突。

## 2. Astro 项目结构建议

Astro 官方文档展示的常见项目结构以 `public/`、`src/`、`astro.config.mjs`、`package.json`、`tsconfig.json` 为核心。

建议结构：

```text
public/
  favicon.svg
  robots.txt
src/
  components/
    Header.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    about.astro
  styles/
    global.css
astro.config.mjs
package.json
tsconfig.json
```

要点：

- `src/pages/` 放路由页面，文件路径会映射为站点路由。
- `src/components/` 放可复用组件，可包含 `.astro` 组件，也可以包含 React/Vue/Svelte 等集成组件。
- `src/layouts/` 放页面布局组件。
- `src/styles/` 放全局样式或共享样式。
- `public/` 放不需要经过构建处理的静态文件。
- 默认静态构建输出目录是 `dist/`。

## 3. Astro 页面和组件写法建议

Astro 页面和组件通常使用 `.astro` 文件。文件可以包含前置脚本区和模板区：

```astro
---
import Header from '../components/Header.astro';

const title = 'Home';
---

<html lang="zh-CN">
  <head>
    <title>{title}</title>
  </head>
  <body>
    <Header />
    <main>
      <h1>{title}</h1>
    </main>
  </body>
</html>
```

建议：

- 页面放在 `src/pages/`，组件放在 `src/components/`。
- 页面级 HTML 骨架可以直接写在页面中，也可以抽到 `src/layouts/`。
- 组件使用大写命名，例如 `Header.astro`、`ThemeToggle.astro`。
- `.astro` 文件的前置脚本区适合写导入、常量、props 读取和构建期逻辑。
- 默认尽量使用 Astro 组件输出静态 HTML，只在需要交互时再引入客户端组件。

## 4. Astro + Tailwind CSS 配置建议

Astro 文档中仍能查到 PostCSS 配置 Tailwind 的方式，但当前项目如从零开始，建议优先使用 Astro 官方 Tailwind 集成或 Astro 文档中当前推荐的集成流程，而不是手写旧式配置。

保守建议：

- 若是新项目，使用 Astro 官方集成命令添加 Tailwind。
- 若项目已经有 Tailwind v4 配置，应优先遵循 Tailwind v4 的 CSS-first 配置方式。
- 若项目使用 Tailwind v3，则保留 `tailwind.config.*` 和 `postcss.config.*` 是常见方式。
- 不要在不了解项目 Tailwind 版本的情况下混用 v3 和 v4 配置风格。

可接受的旧式 PostCSS 形态通常类似：

```js
module.exports = {
  plugins: {
    tailwindcss: {},
  },
};
```

但这更适合已有 v3/旧项目。其他线程如果要实际改代码，应先确认 `package.json` 中的 `tailwindcss` 版本。

## 5. Tailwind 暗色模式建议

Tailwind 文档确认可以使用 `dark:` 变体：

```html
<div class="bg-white dark:bg-black">
  <h1 class="text-gray-900 dark:text-white">Dark mode</h1>
</div>
```

暗色模式策略建议：

- 如果只跟随系统偏好，可以使用 Tailwind 默认的 `prefers-color-scheme` 行为。
- 如果项目需要手动切换主题，建议使用 class 或 data attribute 控制。
- Tailwind v4 中可用 `@custom-variant` 自定义 `dark` 变体，例如基于 `.dark`：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

然后在根元素上加类：

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black"></div>
  </body>
</html>
```

项目建议：

- 若需要主题按钮，使用 `.dark` 或 `data-theme="dark"` 这类显式状态更可控。
- 若只做静态展示站，可先跟随系统主题，减少客户端脚本。
- 不要同时让 `media`、`.dark`、`data-theme` 多套机制互相竞争。

## 6. TypeScript 配置建议

Astro 项目通常包含 `tsconfig.json`。Context7 查询到 Astro 文档建议可加入 Astro TypeScript 插件，以增强编辑器对 `.astro` 文件的支持：

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@astrojs/ts-plugin"
      }
    ]
  }
}
```

保守建议：

- 基础 Astro 项目应保留 `tsconfig.json`。
- 优先使用 Astro 提供的推荐基础配置，再在项目需要时开启更严格规则。
- 页面和组件中如使用 TypeScript，尽量给 props、数据对象和配置对象明确类型。
- 不要把普通 JavaScript 项目一次性强行改成严格 TypeScript；应分步处理类型错误。

## 7. public 目录和静态资源建议

Astro 官方项目结构中 `public/` 用于静态资源，例如：

```text
public/
  robots.txt
  favicon.svg
  my-cv.pdf
```

建议：

- 放在 `public/` 的资源会作为站点根路径下的静态文件提供。
- 例如 `public/favicon.svg` 通常通过 `/favicon.svg` 引用。
- 适合放 `robots.txt`、站点图标、无需构建优化的 PDF、manifest、第三方验证文件等。
- 页面内需要经过优化、打包或导入处理的图片，建议放在 `src/` 下并按 Astro 图片/资源流程处理。

避免：

- 不要在代码里用 `public/favicon.svg` 作为浏览器 URL。
- 不要把所有图片都无脑放入 `public/`；需要优化的图片应考虑放进 `src/`。

## 8. Vercel 部署建议

Astro 文档显示默认静态输出：

- `output` 默认是 `static`。
- `astro build` 默认输出目录是 `dist/`。

Vercel 文档显示：

- Vercel 会根据项目文件和结构自动识别框架，并设置默认安装命令、构建命令和输出目录。
- 这些设置可以在 Vercel 项目设置中覆盖。
- Astro 静态站可使用 `@astrojs/vercel/static` 适配器：

```js
import { defineConfig } from 'astro/config';
import vercelStatic from '@astrojs/vercel/static';

export default defineConfig({
  output: 'static',
  adapter: vercelStatic(),
});
```

依赖安装：

```bash
npm i @astrojs/vercel
```

保守部署建议：

- 构建命令：`astro build`，或通过包管理器脚本 `npm run build` / `pnpm build`。
- 输出目录：默认 `dist`。
- 如果是纯静态站，保持 `output: 'static'`。
- 如果需要 SSR、API 路由或 Vercel Functions，再考虑 `@astrojs/vercel/serverless` 和 `output: 'hybrid'`。
- 不要为了普通静态站过早引入 serverless/hybrid 配置。

## 9. 对其他线程的具体建议

- 先确认项目是否已经初始化 Astro；当前工作区未发现 `package.json`、`astro.config.*`、`src/`、`public/`。
- 如果要初始化项目，建议先生成标准 Astro 结构，再添加 Tailwind。
- Tailwind 配置前必须确认版本：v3 和 v4 的推荐写法不同。
- 静态站部署 Vercel 时，优先使用默认 `dist` 输出，不要改成 `public`。`outDir: 'public'` 是某些平台如 GitLab Pages 的特殊配置，不适合照搬到 Vercel。
- 暗色模式如果需要用户手动切换，建议统一使用根元素 `.dark` 或 `data-theme`，并把脚本放在布局层处理。
- TypeScript 配置应从 Astro 推荐配置开始，不要一次性引入复杂 lint/typecheck 规则阻塞页面开发。
- 资源引用统一约定：`public/foo.svg` 在页面中写 `/foo.svg`。
- Vercel 项目设置中如自动识别 Astro，通常不需要手动覆盖 Build Command 和 Output Directory；只有自动识别失败或 monorepo 才手动配置。

## 10. 需要避免的过时写法

- 避免不查 Tailwind 版本就直接套用 `tailwind.config.js`。Tailwind v4 更偏向 CSS-first 配置，v3 才是传统 config 文件为主。
- 避免将 `public/` 写入资源 URL，例如 `/public/logo.svg` 或 `public/logo.svg`。
- 避免把 Vercel 静态输出目录改成 `public`；Astro 默认 `dist` 更符合常规 Vercel 静态构建。
- 避免为纯静态站引入 SSR/serverless 适配器配置。
- 避免在 Astro 页面中默认引入大量客户端 JavaScript；只有交互组件才需要客户端 hydration。
- 避免把所有页面逻辑都塞进 `src/pages/index.astro`；可复用结构应放到 `components/` 和 `layouts/`。
- 避免在没有现有类型基础时一次性启用过严 TypeScript 规则并重构全项目。
