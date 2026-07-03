# 部署与交接说明

## 1. 使用了哪些插件或工具

- Context7 MCP：已使用，用于查询 Astro 部署到 Vercel 的当前官方推荐方式。选用文档源为 `/withastro/docs`。
- Git：已检查本地仓库状态。当前项目目录已经是 Git 仓库，但存在前序阶段留下的页面与组件改动。
- GitHub Connector：当前可见能力不足以直接创建提交或推送仓库，因此本轮没有通过 GitHub Connector 写入远程仓库。
- Sites 插件：按要求未使用。

本轮主要新增文档：

- `README.md`
- `docs/deploy.md`
- `docs/roadmap.md`
- `docs/handoff/06-deploy-guide.md`

## 2. 本地运行方式

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

默认访问地址通常是：

```text
http://localhost:4321
```

实际端口以终端输出为准。

## 3. 构建方式

执行：

```bash
npm run build
```

当前 `package.json` 中的构建脚本为：

```bash
astro check && astro build
```

静态构建产物输出到：

```text
dist/
```

本地预览生产构建：

```bash
npm run preview
```

## 4. GitHub 推送方式

如果是第一次推送到 GitHub：

```bash
git init
git add .
git commit -m "init personal website with Astro and Tailwind"
git branch -M main
git remote add origin <我的GitHub仓库地址>
git push -u origin main
```

如果仓库已经初始化，只需要提交本轮文档变更，可以使用：

```bash
git add README.md docs/deploy.md docs/roadmap.md docs/handoff/06-deploy-guide.md
git commit -m "docs: add deployment guide and project roadmap"
git push
```

注意：当前工作区已有前序阶段的页面、样式和组件改动。本轮交接建议只把上述文档文件纳入本次文档提交，避免混入未审阅的页面改动。

## 5. Vercel 部署方式

推荐通过 Vercel Dashboard 连接 GitHub 仓库部署：

1. 登录 Vercel。
2. 点击 `New Project`。
3. 选择 GitHub 中的网站仓库。
4. Framework Preset 选择 `Astro`，或保留自动识别结果。
5. 构建命令填写：

```bash
npm run build
```

6. 输出目录填写：

```text
dist
```

7. 点击 `Deploy`。

Context7 查询到的 Astro 官方文档说明：默认 Astro 项目是静态站点，不需要额外配置即可部署到 Vercel。当前项目没有 SSR 或 API 路由需求，因此暂不需要添加 Vercel adapter。后续如果要做服务端渲染或按需渲染，再考虑：

```bash
npx astro add vercel
```

## 6. 域名绑定方式

在 Vercel 项目中：

1. 打开 `Settings` -> `Domains`。
2. 添加根域名和 `www` 域名，例如 `example.com`、`www.example.com`。
3. 按 Vercel 页面提示到 DNS 服务商处添加记录。

常见配置：

```text
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

最终 DNS 记录以 Vercel 项目页面显示为准。DNS 生效可能需要几分钟到数小时。

如果后续使用 Cloudflare 管理 DNS，建议先只开启基础 DNS、HTTPS 和防护能力；遇到验证问题时，以 Vercel 的 Domains 页面提示为准。

## 7. 后期扩展路线

建议按以下顺序推进：

1. 完成 GitHub 与 Vercel 自动部署。
2. 绑定自定义域名。
3. 添加项目详情页。
4. 添加 Markdown 笔记系统。
5. 添加站内搜索。
6. 添加中英文切换。
7. 添加访问统计。
8. 添加 AI 助手入口。
9. 做国内访问优化。
10. 接入 Cloudflare DNS 和基础防护。

详细路线见：

```text
docs/roadmap.md
```

## 8. 当前交接注意事项

- 当前项目适合先作为静态 Astro 网站部署，Vercel 输出目录应使用 `dist`，不要改成 `public`。
- `.gitignore` 已包含 `.env` 和 `.env.local`，不要提交真实密钥。
- 后续如果需要环境变量，应在 Vercel 项目 `Settings` -> `Environment Variables` 中配置。
- 浏览器端可见变量才使用 `PUBLIC_` 前缀，私密 Token 不要暴露给前端。
- 当前工作区有前序页面和样式改动；本轮只负责部署与交接文档，没有大改页面和样式。
- 如果要提交本轮文档，建议 commit message 使用：

```text
docs: add deployment guide and project roadmap
```
