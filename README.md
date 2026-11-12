# Ray_Lee’s Open Library

公开资料仓库，使用原站点的米白、深蓝配色以及明暗主题。

## 页面

- `/` 展示全部公开文件，支持关键词搜索。
- `/ppt/` 展示 PPT 分类。
- `/files/ppt/gpu-volumetric-mosaic-pam.pptx` 提供原始演示文稿下载。

## 添加文件

将公开文件放入 `public/files/<category>/`，并在 `src/data/resources.json` 中填写标题、分类、说明、主题、下载路径、原文件名、字节大小、页数和 SHA-256。

## 开发与验证

使用 Node 24 或更新版本，执行 `npm ci`，然后运行 `npm run dev`。
执行 `npm run build` 和 `npm test` 验证静态页面、文件完整性以及旧内容的移除。
Vercel 通过现有 GitHub 项目的生产分支部署，构建输出目录为 `dist`。
