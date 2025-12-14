# Data-driven, Multilingual CV (Next.js + Prisma + PostgreSQL)

This project is a production-grade, database-first CV/profile site. All content (structure, ordering, activation, translations, and UI rendering hints) lives in PostgreSQL; React never hardcodes CV data. New sections, skills, experiences, or projects appear by inserting rows — no code edits.

## Stack
- Next.js App Router, TypeScript, Tailwind CSS (RSC-first)
- PostgreSQL (JSONB-heavy), Prisma ORM
- API: `GET /api/profile/[slug]?lang=vi|en|ru`
- Dynamic renderers keyed by `Section.uiConfig.variant` (`hero`, `timeline`, `cards`, `badges`, `icons`, `list`)

## Setup
1) Install deps  
`npm install`

2) Environment  
Set `DATABASE_URL` and `DIRECT_URL` in `.env` (example already provided). Connection is SSL-required per Aiven cluster.

3) Migrate & seed  
`npx prisma migrate dev`  
`npm run db:seed`

4) Run dev server  
`npm run dev` then open `http://localhost:3000`. The home route auto-redirects to the first profile slug in the DB using the default language.

> Prisma migrate may print an `EPIPE` on Windows after applying migrations; the schema is still applied. Run `npx prisma generate` afterwards if needed.

## Data model (Prisma)
- `Profile` — core identity, slug, level, DOB, metadata (JSONB)
- `ProfileTranslation` — language-specific name/headline/summary + SEO fields
- `Section` — dynamic blocks: key, order, isActive, `uiConfig` (JSONB), metadata
- `SectionTranslation` — title/subtitle/description per language
- `SectionItem` — entries inside a section: itemType, order, metadata (JSONB), isActive
- `SectionItemTranslation` — per-language text/metadata for items
- `Language` enum: `vi`, `en`, `ru`

## Data flow
- `getProfile(slug, lang)` (see `src/lib/profile.ts`) pulls the profile, sections, items, merges translation metadata, and returns a render-ready shape.
- Server page: `app/[lang]/[slug]/page.tsx` uses `ProfileShell` + `SectionRenderer` to render purely from DB data and `uiConfig.variant`.
- API route: `app/api/profile/[slug]/route.ts` returns the same payload for clients/preview tools.
- SEO: `generateMetadata` reads `ProfileTranslation` for title/description/keywords and sets language alternates for `/vi|en|ru/{slug}`.

## Adding or editing content (no code changes)
Use SQL, Prisma Studio (`npx prisma studio`), or any DB tool to modify rows:
1) Sections  
   - Insert into `Section` with `key`, `displayOrder`, `isActive`, `uiConfig` (e.g. `{ "variant": "timeline", "columns": 1, "showMetadataKeys": ["company","startDate","endDate"] }`).  
   - Add `SectionTranslation` rows for each language (`language`, `title`, `subtitle`, `description`).
2) Items  
   - Insert into `SectionItem` with `sectionId`, `itemType`, `displayOrder`, `metadata` (any JSON shape).  
   - Add `SectionItemTranslation` rows per language (`title`, `subtitle`, `description`, `metadata` for localized labels).
3) Content edits are DB-only; UI auto-renders based on `uiConfig.variant` and the metadata you store.

## Adding a new language
1) Extend the `Language` enum in `prisma/schema.prisma` and regenerate/migrate Prisma.  
2) Add the language code to `supportedLanguages` in `src/lib/i18n.ts`.  
3) Insert new `ProfileTranslation`, `SectionTranslation`, and `SectionItemTranslation` rows for the new language.  
No JSON locale files are needed; translations stay in the database.

## Updating CV data
- Profile text: update `ProfileTranslation` rows.
- SEO: edit `seoTitle`, `seoDescription`, `seoKeywords`, `seoMetadata` in `ProfileTranslation`.
- Ordering/visibility: change `displayOrder` or `isActive` on `Section`/`SectionItem`.
- UI behavior: adjust `Section.uiConfig` (e.g., swap `variant` to `cards`, change `columns`, or tweak `showMetadataKeys`).

## Seeded profile
The seed script (`prisma/seed.ts`) provisions:
- Profile: Nguyễn Thành Mạnh (DOB 2005-11-18), level Senior
- Languages: `vi`, `en`, `ru`
- Sections: `hero`, `socials`, `skills`, `experience`, `projects`, `education`
- JSONB-rich metadata for timelines, cards, badges, social icons, and SEO.
