# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro 5 blog using the **vhAstro-Theme** with Less styling, swup page transitions, and Pagefind search. Deployed to Cloudflare Pages (wrangler.jsonc present). Package manager is **pnpm**.

## Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start dev server (astro dev)
pnpm build            # production build + Pagefind index (astro build && pagefind --site dist)
pnpm preview          # preview production build
pnpm newpost "标题"    # create new post → src/content/blog/YYYY/MM/标题.md
```

## Architecture

### Routing & Layout

- `src/pages/[...page].astro` — home with paginated article list (15 per page)
- `src/pages/article/[...article].astro` — individual article pages, routed by `post.data.id`
- `src/pages/categories/[...categories].astro`, `tag/[...tags].astro` — taxonomy pages
- `src/layouts/Layout/Layout.astro` — main layout shell: Header, MainHeader (banner), Aside sidebar, content slot, Footer, BackTop, TOC drawer
- `src/layouts/PageLayout/PageLayout.astro` — secondary layout for standalone pages

### SPA Navigation (ViewTransitions)

Page transitions use Astro's native `<ViewTransitions />` (from `astro:transitions`). Client-side scripts register via `inRouter` / `outRouter` from `@/utils/updateRouter` to re-initialize on navigation. `src/scripts/Init.ts` is the central bootstrap — it calls all feature inits on page load and re-calls them (with `only=false`) on `astro:page-load`, and destroys players/observers on `astro:before-swap`.

**Important**: The Init script lives in a dedicated `src/components/InitScript/InitScript.astro` component (not directly in Layout.astro) because Astro 5 drops `<script>` tags with ES module imports when ViewTransitions is enabled.

### Content System

- Blog posts live in `src/content/blog/` as `.md` or `.mdx` files
- Schema defined in `src/content.config.ts`: `title`, `date`, `categories`, `tags`, `id`, `cover`, `recommend`, `hide`, `top`
- Posts sorted by date descending; `top: true` pins to front; `hide: true` excludes from listing
- `pnpm newpost` scaffolds into `src/content/blog/YYYY/MM/` with auto-generated SHA-based id

### Custom Markdown Plugins

- `src/plugins/markdown.custom.ts` — remark plugin (`remarkNote`) for directives (`:::note`, `::btn`, `:::picture`, `:::vhVideo`), plus rehype plugin (`addClassNames`) for link target=_blank, code block wrappers, image lazy-load transforms, and heading extraction to frontmatter
- `src/plugins/shiki-line-highlight.ts` — Shiki transformer for line highlighting in code blocks

### Scripts (client-side)

All in `src/scripts/`. Each exports an init function. Key ones: `Code.ts` (copy button, language labels), `Search.ts` (Pagefind integration), `vhLazyImg.ts` (lazy loading), `ViewImage.ts` (lightbox), `Music.ts` / `Video.ts` (media players), `Toc.ts` (heading highlight observer), `Comment.ts` (Giscus/Twikoo/Waline), `ZenMode.ts` (focus mode).

### Configuration

- `src/config.ts` — site metadata, theme CSS variables, nav, sidebar, ads, analytics, comment system, reward QR codes
- `astro.config.mjs` — Astro integrations (swup, sitemap, mdx, compress, brotli), markdown plugins, Vite alias

### Path Alias

`@/` maps to `src/` via Vite config in `astro.config.mjs`.

### Styling

All styles use **Less** (`.less` files). Global styles in `src/styles/`, component styles colocated with components. Theme colors controlled via CSS custom properties from `src/config.ts` → injected as `<style>:root{...}` in Layout.

## Writing Blog Posts

Follow the style guide in `.claude/rules/blog-writing.md`. Key rules:

- Frontmatter: `title` (string, ≤30 chars), `date` (YYYY-MM-DD), `categories` (quoted string), `tags` (array), `id` (unique string), `cover` (webp path in banner/ dir)
- Short paragraphs (2-3 sentences), spaces between Chinese and English/numbers
- Use `:::note{type="info|success|warning"}` for callouts, `::btn[text]{link="url"}` for buttons
- Code blocks must declare language; use tables for multi-dimensional comparisons
- Heading hierarchy: `##` for sections, `###` for subsections; never use `#` (auto-generated)
