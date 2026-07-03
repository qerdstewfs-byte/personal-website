# 部署指南

本文档说明如何将当前 Astro 静态网站推送到 GitHub，并通过 Vercel 部署、绑定自定义域名和维护后续自动部署。

## 文档依据

本轮使用 Context7 MCP 查询了 Astro 官方文档，选用文档源 `/withastro/docs`。当前 Astro 官方文档说明：Astro 项目可以作为静态站点或服务端渲染站点部署到 Vercel；默认 Astro 项目是静态站点，不需要额外部署配置。当前项目属于静态网站，因此建议先保持默认静态构建。

当前推荐配置：

- Build Command: `npm run build`
- Output Directory: `dist`
- Vercel Adapter: 当前静态站点不需要添加。后续如果需要 SSR、API routes、on-demand rendering，再执行 `npx astro add vercel` 并按需求配置。

## 连接 GitHub 仓库

1. 在 GitHub 新建一个空仓库，例如 `my-website`。
2. 不要在 GitHub 页面初始化 README、`.gitignore` 或 license，避免和本地文件产生冲突。
3. 在本地项目目录执行：

```bash
git init
git add .
git commit -m "init personal website with Astro and Tailwind"
git branch -M main
git remote add origin <我的GitHub仓库地址>
git push -u origin main
```

如果本地已经有 Git 仓库，只需要确认远程地址：

```bash
git remote -v
```

如果还没有远程地址：

```bash
git remote add origin <我的GitHub仓库地址>
git push -u origin main
```

## 导入 Astro 项目到 Vercel

1. 登录 Vercel。
2. 点击 `Add New...` 或 `New Project`。
3. 从 GitHub 选择当前网站仓库。
4. 如果 Vercel 自动识别 Astro，保留默认配置即可。
5. 如果需要手动配置，使用：
   - Framework Preset: `Astro`
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 `Deploy`。

## 查看部署地址

部署完成后，Vercel 会生成一个默认访问地址，通常类似：

```text
https://<project-name>.vercel.app
```

后续每次部署记录都可以在 Vercel 项目的 `Deployments` 页面查看。点击任意部署项可以查看构建日志、部署状态和访问地址。

## 绑定自定义域名

1. 进入 Vercel 项目。
2. 打开 `Settings` -> `Domains`。
3. 输入你的域名，例如：

```text
example.com
www.example.com
```

4. 根据 Vercel 提示到域名 DNS 服务商处添加记录。

常见 DNS 记录：

```text
类型: A
名称: @
值: 76.76.21.21
```

```text
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

具体记录以 Vercel 页面实时提示为准。DNS 生效可能需要几分钟到数小时。

## 后续自动部署

Vercel 连接 GitHub 仓库后，默认会启用自动部署：

- 推送到 `main` 分支后，自动触发 Production Deployment。
- 推送到其他分支或 Pull Request 后，自动生成 Preview Deployment。
- 每个部署都有独立 URL，方便预览和回滚。

常规更新流程：

```bash
git add .
git commit -m "docs: update website content"
git push
```

## 环境变量

当前项目是静态个人主页，暂时不需要环境变量。后续如果接入统计、搜索、AI 助手或 CMS，可以在 Vercel 中配置：

1. 打开 Vercel 项目。
2. 进入 `Settings` -> `Environment Variables`。
3. 添加变量名和值。
4. 选择作用环境：Production、Preview、Development。
5. 保存后重新部署。

Astro 中如果需要暴露给浏览器端使用的环境变量，变量名通常应以 `PUBLIC_` 开头，例如：

```text
PUBLIC_ANALYTICS_ID=xxxx
```

不要把私钥、Token、数据库密码等敏感信息放入 `PUBLIC_` 变量。

## 避免提交 .env

当前 `.gitignore` 已包含：

```text
.env
.env.local
```

注意事项：

- 不要提交 `.env`、`.env.local`、`.env.production` 等包含真实密钥的文件。
- 如果需要说明变量格式，可以提交 `.env.example`，但里面只能放占位值。
- 如果误提交了密钥，应立即在对应平台撤销或轮换密钥，再清理 Git 历史。

推荐示例：

```text
PUBLIC_ANALYTICS_ID=replace-me
PRIVATE_API_TOKEN=replace-me
```
