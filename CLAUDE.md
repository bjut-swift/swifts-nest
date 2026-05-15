# swifts-nest

北京工业大学 SWIFT 学生组织官网 — https://www.bjutswift.cn

## 技术栈

Next.js 16 (Pages Router) / React 19 / Tailwind CSS 4 / Prisma / TypeScript / Bun

## 开发

```bash
bun install
bun dev
```

## 构建时静态生成

构建时在 `getStaticProps`（`src/pages/index.tsx`）中自动生成：

- `public/rss.xml` — 博客 RSS 订阅源（`src/lib/rss.ts`）
- `public/content.json` — 全站内容元数据，含 blog / projects / library（`src/lib/content-json.ts`）

`content.json` 是 GitHub 组织首页（`bjut-swift/.github`）自动同步的数据源。

## 组织首页同步 `[sync-profile]`

在 commit message 中加入 `[sync-profile]` 标记，push 到 main 后会自动触发 `bjut-swift/.github` 仓库的 Action，拉取最新的 `content.json` 并更新组织 profile README。

**什么时候加这个标记：** 新增/修改/删除了 blog 文章、项目展示、技术速查等内容，希望同步到 GitHub 组织首页时。日常代码改动不需要加。

流程：`swifts-nest push [sync-profile]` → `dispatch` → `bjut-swift/.github` Action → 更新 `profile/README.md`

需要 `ORG_DISPATCH_TOKEN` secret（有 repo scope 的 PAT）配置在 swifts-nest 仓库的 Settings > Secrets 中。
