# 安全与构建检查交接

## 1. 使用了哪些插件或工具

- Codex Security：已读取安全扫描流程说明。本轮按用户要求做定向安全卫生检查，未启动完整仓库级深度扫描工作台。
- Browser：已使用应用内浏览器检查桌面首页、导航、暗色模式和控制台错误。
- PowerShell / ripgrep：用于运行 `npm install`、`npm run build`、Git 跟踪文件检查、敏感信息关键词扫描、外链和第三方脚本扫描。
- Vite 静态预览：因当前环境中 `astro dev` 后台服务无法稳定保活，改用构建后的 `dist` 启动临时只读静态预览完成浏览器检查。

## 2. 构建是否通过

通过。

- `npm.cmd install`：通过。PowerShell 直接运行 `npm install` 会被本机执行策略拦截 `npm.ps1`，已改用 `npm.cmd install`。
- `npm.cmd run build`：通过。
- `astro check`：0 errors、0 warnings、0 hints。
- `astro build`：成功生成 6 个静态页面到 `dist/`。

## 3. 修复了哪些问题

- 修复了 `src/components/Header.astro`、`ThemeToggle.astro`、`ProjectCard.astro`、`Footer.astro` 中的中文乱码和可访问性文案。
- 修复了 `src/pages/index.astro`、`projects.astro`、`about.astro`、`notes.astro`、`research.astro`、`resume.astro` 中的中文乱码。
- 确认页脚外部 GitHub 链接保留 `target="_blank"` 与 `rel="noopener noreferrer"`。
- 邮箱链接为 `mailto:`，未使用新窗口打开，不需要 `noopener noreferrer`。

## 4. 是否发现敏感信息

未发现明显敏感信息硬编码。

已检查关键词范围包括 API Key、Token、密码、邮箱授权码、数据库连接字符串、私人手机号、身份证、详细住址、隐私照片路径等。当前源码中仅发现公开占位邮箱 `example@example.com` / `hello@example.com` 和占位 GitHub 链接，不属于真实敏感信息。

## 5. 是否发现外链安全问题

未发现外链安全问题。

- `target="_blank"` 外链已带 `rel="noopener noreferrer"`。
- 未发现外部图片、外部脚本或外部字体 CDN 引用。
- 未发现统计代码、追踪脚本或第三方嵌入脚本。

## 6. 是否发现不必要第三方依赖

未发现不必要第三方依赖。

当前依赖集中在 Astro、Tailwind CSS、TypeScript 与 Astro 类型检查相关包。未发现登录、数据库、评论、上传、后台管理、用户注册相关依赖或代码路径。

`npm install` 提示 `esbuild` 有安装脚本待 approve，这是 Astro/Vite 构建链常见依赖提示；构建已通过，当前未额外批准脚本。

## 7. 当前还需要人工确认的安全事项

- `public/resume.pdf` 需要人工确认是否包含真实手机号、身份证号、详细住址、成绩单、证件照或其他不适合公开的信息。
- `public/avatar.png` 需要人工确认是否为可公开头像。
- `https://github.com/your-github`、`example@example.com`、`hello@example.com` 仍是占位内容，上线前应替换为真实且可公开的联系方式，或继续保留占位。
- Browser 手机端布局检查因工具超时未完成最终自动化确认；建议上线前人工用手机宽度复核导航菜单和页面横向溢出。
- 当前 docs/handoff 中早期文档存在乱码，不影响构建，但如这些文档需要对外公开，建议单独修复。

## 8. 上线前检查清单

- [ ] 再次运行 `npm.cmd install` 和 `npm.cmd run build`。
- [ ] 确认 `.gitignore` 包含 `node_modules`、`dist`、`.env`、`.env.local`、`.DS_Store`。
- [ ] 运行 `git status --short`，确认 `.env`、`node_modules`、`dist` 没有进入提交。
- [ ] 复查 `public/resume.pdf` 和 `public/avatar.png` 是否适合公开。
- [ ] 替换或确认公开邮箱、GitHub 链接和站点名称。
- [ ] 用桌面浏览器检查首页、项目、科研、学习记录、简历、关于页面。
- [ ] 用手机宽度检查导航菜单、暗色模式、页面横向滚动和文字溢出。
- [ ] 确认没有新加入登录系统、数据库、评论系统、文件上传、后台管理、用户注册。
- [ ] 确认没有新加入统计代码、外部字体 CDN 或不必要第三方脚本。
- [ ] 部署后检查生产站控制台错误、404、资源加载和外链打开行为。
