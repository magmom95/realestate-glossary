# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean real estate glossary web app — a search-based learning engine for real estate terminology. All content is in Korean. 120+ terms across 12 categories with scored search, analogy-based explanations, and related-term navigation.

## Commands

```bash
pnpm install        # install dependencies (pnpm-lock.yaml present)
pnpm dev            # local dev server (Next.js)
pnpm build          # production build
pnpm lint           # ESLint via next lint
```

## Architecture

- **Framework**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Deployment**: Vercel (see vercel.json)
- **Data**: All glossary data lives in a single static array in `data/glossary.ts` — no database. Each entry is a `RealEstateGlossaryItem` (defined in `lib/types.ts`) with fields: id, term, aliases, category, subcategory, easy_def, analogy, example, note, risk, level, related_terms, keywords, is_slang.
- **Search**: Client-side scored search in `lib/search.ts` — scoring weights: exact term match (100) > alias match (80) > keyword includes (50) > term includes (40) > definition includes (20) > analogy includes (10). Beginner terms get +5 boost, slang gets -5.
- **Routing**:
  - `/` — homepage with stats, categories, beginner flows
  - `/search?q=...&level=...` — client-side search results page (`'use client'`)
  - `/terms/[id]` — static term detail page (uses `generateStaticParams`)
  - `/category/[slug]` — static category listing (uses `generateStaticParams`)
  - `/api/suggest-term` — POST endpoint that sends suggestion emails via Resend

## Key Patterns

- Term detail and category pages are statically generated at build time via `generateStaticParams`.
- The search page is the only client component; everything else is server-rendered.
- `related_terms` in glossary entries reference other items by `id`. If fewer than 3 related terms resolve, `getRelatedTerms` backfills with same-category items.
- The suggest-term API uses the Resend SDK and requires a `RESEND_API_KEY` env var.
- Design uses a dark theme with accent color `#e8c97d`. Custom Tailwind tokens are defined in `tailwind.config.ts` (colors, fonts, animations). The app uses Pretendard (sans) and DM Serif Display (display) fonts.

## Adding New Terms

Add entries to the `glossaryData` array in `data/glossary.ts`. Each entry needs a unique `id` (used as URL slug and for `related_terms` references). Category must be one of the 12 `TermCategory` values in `lib/types.ts`. Level must be '입문', '중급', or '고급'.
