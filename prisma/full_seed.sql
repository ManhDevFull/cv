-- Full schema + seed for data-driven multilingual CV
-- Run with: psql "$DATABASE_URL" -f prisma/full_seed.sql

BEGIN;
-- Enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Language') THEN
    CREATE TYPE "Language" AS ENUM ('vi', 'en', 'ru');
  END IF;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "level" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure defaults exist even if table pre-existed
ALTER TABLE "Profile"
  ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "Profile"
SET "createdAt" = COALESCE("createdAt", CURRENT_TIMESTAMP),
    "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP)
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;

CREATE TABLE IF NOT EXISTS "ProfileTranslation" (
    "id" TEXT PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
    "language" "Language" NOT NULL,
    "fullName" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "seoMetadata" JSONB,
    CONSTRAINT "ProfileTranslation_profileId_language_key" UNIQUE ("profileId","language")
);

CREATE TABLE IF NOT EXISTS "Section" (
    "id" TEXT PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
    "key" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "uiConfig" JSONB NOT NULL,
    "metadata" JSONB,
    CONSTRAINT "Section_profileId_key_key" UNIQUE ("profileId","key")
);
CREATE INDEX IF NOT EXISTS "Section_profileId_displayOrder_idx" ON "Section"("profileId","displayOrder");

CREATE TABLE IF NOT EXISTS "SectionTranslation" (
    "id" TEXT PRIMARY KEY,
    "sectionId" TEXT NOT NULL REFERENCES "Section"("id") ON DELETE CASCADE,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    CONSTRAINT "SectionTranslation_sectionId_language_key" UNIQUE ("sectionId","language")
);

CREATE TABLE IF NOT EXISTS "SectionItem" (
    "id" TEXT PRIMARY KEY,
    "sectionId" TEXT NOT NULL REFERENCES "Section"("id") ON DELETE CASCADE,
    "itemType" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "SectionItem_sectionId_displayOrder_idx" ON "SectionItem"("sectionId","displayOrder");

CREATE TABLE IF NOT EXISTS "SectionItemTranslation" (
    "id" TEXT PRIMARY KEY,
    "sectionItemId" TEXT NOT NULL REFERENCES "SectionItem"("id") ON DELETE CASCADE,
    "language" "Language" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    CONSTRAINT "SectionItemTranslation_sectionItemId_language_key" UNIQUE ("sectionItemId","language")
);

-- Seed data (deterministic IDs so script is repeatable)
-- Profile
INSERT INTO "Profile" ("id","slug","level","dateOfBirth","metadata")
VALUES (
  'profile-nguyen-thanh-manh',
  'nguyen-thanh-manh',
  'Senior',
  '2005-11-18',
  '{
    "cvLevel": "Senior",
    "location": "Da Nang, Viet Nam",
    "focus": ["Next.js","Prisma","PostgreSQL","System design"],
    "availability": "Open for backend/full-stack roles"
  }'::jsonb
)
ON CONFLICT ("slug") DO UPDATE
SET "level" = EXCLUDED."level",
    "dateOfBirth" = EXCLUDED."dateOfBirth",
    "metadata" = EXCLUDED."metadata",
    "updatedAt" = CURRENT_TIMESTAMP;

-- Profile translations
INSERT INTO "ProfileTranslation" ("id","profileId","language","fullName","headline","summary","seoTitle","seoDescription","seoKeywords","seoMetadata")
VALUES
('pt-vi-main','profile-nguyen-thanh-manh','vi',
 'Nguyễn Thành Mạnh',
 'Senior Full-Stack Engineer · Next.js · Prisma · PostgreSQL',
 'Xây dựng hệ thống web hướng dữ liệu, tối ưu hiệu năng và hỗ trợ nhóm shipping nhanh mà vẫn kiểm soát kiến trúc.',
 'Nguyễn Thành Mạnh | Senior Full-Stack Engineer',
 'Senior Full-Stack Engineer tập trung Next.js, Prisma, PostgreSQL. Chuyên thiết kế kiến trúc data-driven, tối ưu JSONB và mở rộng tính năng nhanh.',
 ARRAY['Nguyễn Thành Mạnh','Full-Stack Engineer','Next.js CV','Prisma','PostgreSQL'],
 '{"openGraph":{"type":"profile"}}'::jsonb),
('pt-en-main','profile-nguyen-thanh-manh','en',
 'Nguyễn Thành Mạnh',
 'Senior Full-Stack Engineer focused on Next.js, Prisma, PostgreSQL',
 'Designs data-first architectures, ships resilient web products end to end, and mentors teams to deliver faster with guardrails.',
 'Nguyễn Thành Mạnh | Senior Full-Stack Engineer',
 'Senior Full-Stack Engineer specialized in Next.js App Router, Prisma ORM, and PostgreSQL JSONB. Builds scalable, content-driven experiences.',
 ARRAY['Nguyen Thanh Manh','Full-Stack Next.js','Prisma engineer','PostgreSQL JSONB','Data driven CV'],
 '{"openGraph":{"type":"profile"}}'::jsonb),
('pt-ru-main','profile-nguyen-thanh-manh','ru',
 'Нгуен Тхань Манх',
 'Senior Full-Stack инженер, Next.js / Prisma / PostgreSQL JSONB',
 'Проектирует data-driven веб‑системы, отвечает за архитектуру и скорость поставки функционала, наставляет команду.',
 'Нгуен Тхань Манх | Senior Full-Stack инженер',
 'Senior Full-Stack инженер, специализация Next.js, Prisma и PostgreSQL JSONB. Строит масштабируемые продукты и контентные платформы.',
 ARRAY['Нгуен Тхань Манх','Full-Stack инженер','Next.js','Prisma','PostgreSQL'],
 '{"openGraph":{"type":"profile"}}'::jsonb)
ON CONFLICT ("profileId","language") DO UPDATE
SET "fullName" = EXCLUDED."fullName",
    "headline" = EXCLUDED."headline",
    "summary" = EXCLUDED."summary",
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "seoKeywords" = EXCLUDED."seoKeywords",
    "seoMetadata" = EXCLUDED."seoMetadata";

-- Sections
INSERT INTO "Section" ("id","profileId","key","displayOrder","isActive","uiConfig","metadata") VALUES
('sec-hero','profile-nguyen-thanh-manh','hero',1,TRUE,'{"variant":"hero","columns":2,"accent":"emerald","background":"grid"}','{"stats":[{"label":"Projects shipped","value":"15+"},{"label":"Production users","value":"1M+"},{"label":"Team size","value":"4-6 devs"}]}'),
('sec-socials','profile-nguyen-thanh-manh','socials',2,TRUE,'{"variant":"icons","columns":4,"minimal":true}',NULL),
('sec-skills','profile-nguyen-thanh-manh','skills',3,TRUE,'{"variant":"badges","columns":3,"showMetadataKeys":["keywords","level"]}',NULL),
('sec-experience','profile-nguyen-thanh-manh','experience',4,TRUE,'{"variant":"timeline","columns":1,"accent":"emerald","showMetadataKeys":["company","location","startDate","endDate","techStack"]}',NULL),
('sec-projects','profile-nguyen-thanh-manh','projects',5,TRUE,'{"variant":"cards","columns":2,"emphasize":"impact"}',NULL),
('sec-education','profile-nguyen-thanh-manh','education',6,TRUE,'{"variant":"list","columns":1}',NULL)
ON CONFLICT ("profileId","key") DO UPDATE
SET "displayOrder" = EXCLUDED."displayOrder",
    "isActive" = EXCLUDED."isActive",
    "uiConfig" = EXCLUDED."uiConfig",
    "metadata" = EXCLUDED."metadata",
    "updatedAt" = CURRENT_TIMESTAMP;

-- Section translations
INSERT INTO "SectionTranslation" ("id","sectionId","language","title","subtitle","description","metadata") VALUES
-- hero
('st-hero-vi','sec-hero','vi','Giới thiệu','Ảnh chụp nhanh về hồ sơ','Tập trung xây dựng nền tảng data-driven, tối ưu trải nghiệm người dùng và giữ kiến trúc gọn gàng để scale dài hạn.',NULL),
('st-hero-en','sec-hero','en','Overview','Snapshot of the profile','Data-first engineering with a focus on resilient delivery, measurable impact, and long-term maintainability.',NULL),
('st-hero-ru','sec-hero','ru','Обзор','Быстрое резюме профиля','Data-driven подход, устойчивые поставки и архитектура, которую легко сопровождать и масштабировать.',NULL),
-- socials
('st-socials-vi','sec-socials','vi','Kết nối','Liên hệ & mạng xã hội',NULL,NULL),
('st-socials-en','sec-socials','en','Connect','Social and contact channels',NULL,NULL),
('st-socials-ru','sec-socials','ru','Контакты','Соцсети и связь',NULL,NULL),
-- skills
('st-skills-vi','sec-skills','vi','Kỹ năng','Nhóm kỹ năng chính',NULL,NULL),
('st-skills-en','sec-skills','en','Skills','Core capabilities',NULL,NULL),
('st-skills-ru','sec-skills','ru','Навыки','Основные компетенции',NULL,NULL),
-- experience
('st-exp-vi','sec-experience','vi','Kinh nghiệm','Hành trình nghề nghiệp',NULL,NULL),
('st-exp-en','sec-experience','en','Experience','Career journey',NULL,NULL),
('st-exp-ru','sec-experience','ru','Опыт','Профессиональный путь',NULL,NULL),
-- projects
('st-proj-vi','sec-projects','vi','Dự án tiêu biểu','Một vài sản phẩm gần đây',NULL,NULL),
('st-proj-en','sec-projects','en','Highlighted Projects','Recent, representative work',NULL,NULL),
('st-proj-ru','sec-projects','ru','Проекты','Последние значимые работы',NULL,NULL),
-- education
('st-edu-vi','sec-education','vi','Học vấn','Nền tảng học thuật',NULL,NULL),
('st-edu-en','sec-education','en','Education','Academic foundation',NULL,NULL),
('st-edu-ru','sec-education','ru','Образование','Академическая база',NULL,NULL)
ON CONFLICT ("sectionId","language") DO UPDATE
SET "title" = EXCLUDED."title",
    "subtitle" = EXCLUDED."subtitle",
    "description" = EXCLUDED."description",
    "metadata" = EXCLUDED."metadata";

-- Section items
INSERT INTO "SectionItem" ("id","sectionId","itemType","displayOrder","isActive","metadata") VALUES
-- hero item
('item-hero','sec-hero','hero',1,TRUE,'{
  "highlights":[
    {"label":"Data-driven UI & content architecture","icon":"database"},
    {"label":"Ships fast with clean domain boundaries","icon":"rocket"},
    {"label":"Coaches squads and leads engineering rituals","icon":"users"}
  ],
  "actions":[
    {"key":"contact","href":"mailto:ntmanh@ntmanh.io.vn","variant":"primary"},
    {"key":"github","href":"https://github.com/ntmanh","variant":"ghost"}
  ],
  "tags":["Next.js","Prisma","PostgreSQL","Tailwind"]
}'::jsonb),
-- socials
('item-social-github','sec-socials','social_link',1,TRUE,'{"platform":"GitHub","url":"https://github.com/ntmanh","icon":"github","username":"ntmanh"}'),
('item-social-linkedin','sec-socials','social_link',2,TRUE,'{"platform":"LinkedIn","url":"https://www.linkedin.com/in/ntmanh","icon":"linkedin","username":"ntmanh"}'),
('item-social-email','sec-socials','social_link',3,TRUE,'{"platform":"Email","url":"mailto:ntmanh@ntmanh.io.vn","icon":"mail","username":"ntmanh@ntmanh.io.vn"}'),
('item-social-web','sec-socials','social_link',4,TRUE,'{"platform":"Website","url":"https://ntmanh.dev","icon":"globe","username":"ntmanh.dev"}'),
-- skills
('item-skill-backend','sec-skills','skill',1,TRUE,'{"category":"Backend","level":"Advanced","keywords":["Node.js","Next.js API",".NET Core","Prisma","PostgreSQL","Redis"]}'),
('item-skill-frontend','sec-skills','skill',2,TRUE,'{"category":"Frontend","level":"Advanced","keywords":["React Server Components","Next.js App Router","Tailwind CSS","TypeScript","Design systems","Accessibility"]}'),
('item-skill-cloud','sec-skills','skill',3,TRUE,'{"category":"Cloud & DevOps","level":"Intermediate","keywords":["Docker","Kubernetes","CI/CD","Aiven","Vercel","Grafana"]}'),
('item-skill-data','sec-skills','skill',4,TRUE,'{"category":"Data & Analytics","level":"Intermediate","keywords":["JSONB modeling","Query optimization","ETL","dbt","Event analytics"]}'),
('item-skill-lead','sec-skills','skill',5,TRUE,'{"category":"Leadership","level":"Senior","keywords":["Technical leadership","Mentoring","Code review","Backlog shaping","Documentation"]}'),
-- experience
('item-exp-vertex','sec-experience','job',1,TRUE,'{"company":"Vertex E-commerce","role":"Senior Full-Stack Engineer","location":"Remote","startDate":"2024-01","endDate":null,"techStack":["Next.js","Prisma","PostgreSQL",".NET","Docker"],"achievements":["Rebuilt storefront to App Router and server components","Cut render time 35% via JSONB driven caching","Mentored 4 engineers, codified review checklists"]}'),
('item-exp-dnlab','sec-experience','job',2,TRUE,'{"company":"Da Nang Tech Lab","role":"Full-Stack Engineer","location":"Da Nang, Viet Nam","startDate":"2022-06","endDate":"2023-12","techStack":["Next.js","Express","PostgreSQL","Redis"],"achievements":["Implemented modular design system for marketing sites","Reduced cold-start latency for APIs by 25%","Built analytics events pipeline for product metrics"]}'),
('item-exp-freelance','sec-experience','job',3,TRUE,'{"company":"Freelance","role":"Full-Stack Builder","location":"Remote","startDate":"2021-01","endDate":"2022-05","techStack":["Next.js","Supabase","Tailwind","Vercel"],"achievements":["Delivered custom dashboards for SMEs","Set up CI/CD and observability for small teams"]}'),
-- projects
('item-proj-cv','sec-projects','project',1,TRUE,'{"key":"cv-platform","links":[{"label":"Repository","href":"https://github.com/ntmanh/data-driven-cv"}],"techStack":["Next.js","Prisma","PostgreSQL","Tailwind","RSC"],"highlights":["DB-driven profile schema with JSONB metadata","Generic renderers keyed by uiConfig.variant","SEO metadata sourced from translations"],"impact":"New sections can be added via inserts only; zero code changes required."}'),
('item-proj-commerce','sec-projects','project',2,TRUE,'{"key":"commerce-accelerator","links":[{"label":"Case study","href":"https://ntmanh.dev/case/commerce"}],"techStack":["Next.js","Edge runtime","Redis cache","Storyblok"],"highlights":["Composable blocks mapped from CMS JSON","Edge caching strategy for product detail pages"],"impact":"Reduced TTFB by 32% and enabled marketers to ship pages without code."}'),
('item-proj-learning','sec-projects','project',3,TRUE,'{"key":"learning-analytics","links":[{"label":"Demo","href":"https://ntmanh.dev/demo/learning"}],"techStack":["Next.js","ClickHouse","Drizzle ETL","Tailwind"],"highlights":["Event ingestion pipeline with dbt-style models","Interactive dashboards with drilldowns"],"impact":"Surfaced learner health metrics to instructors weekly."}'),
-- education
('item-edu-main','sec-education','education',1,TRUE,'{"school":"Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng (University of Technology and Education – The University of Danang)","degree":"Software Engineering","startDate":"2023-09","endDate":null,"focus":["Web engineering","Distributed systems","Data modeling"]}')
ON CONFLICT ("id") DO UPDATE
SET "itemType" = EXCLUDED."itemType",
    "displayOrder" = EXCLUDED."displayOrder",
    "isActive" = EXCLUDED."isActive",
    "metadata" = EXCLUDED."metadata",
    "updatedAt" = CURRENT_TIMESTAMP;

-- Section item translations
INSERT INTO "SectionItemTranslation" ("id","sectionItemId","language","title","subtitle","description","metadata") VALUES
-- hero
('sit-hero-vi','item-hero','vi','Nguyễn Thành Mạnh','Senior Full-Stack Engineer · Next.js · Prisma · PostgreSQL','Xây dựng hệ thống web hướng dữ liệu, tối ưu hiệu năng và hỗ trợ nhóm shipping nhanh mà vẫn kiểm soát kiến trúc.','{"location":"Đà Nẵng, Việt Nam · Remote","availability":"Sẵn sàng cho dự án backend/full-stack","highlights":[{"label":"Kiến trúc data-driven, dễ mở rộng","icon":"database"},{"label":"Triển khai nhanh, code rõ ràng","icon":"bolt"},{"label":"Mentor & review chất lượng","icon":"sparkles"}],"actions":[{"key":"contact","label":"Liên hệ","href":"mailto:ntmanh@ntmanh.io.vn","variant":"primary"},{"key":"github","label":"Github","href":"https://github.com/ntmanh","variant":"secondary"}]}'::jsonb),
('sit-hero-en','item-hero','en','Nguyễn Thành Mạnh','Senior Full-Stack Engineer focused on Next.js, Prisma, PostgreSQL','Designs data-first architectures, ships resilient web products end to end, and mentors teams to deliver faster with guardrails.','{"location":"Da Nang, Viet Nam · Remote","availability":"Open for backend/full-stack engagements","highlights":[{"label":"Data-driven architecture","icon":"database"},{"label":"Rapid delivery with guardrails","icon":"bolt"},{"label":"Mentorship & documentation","icon":"book-open"}],"actions":[{"key":"contact","label":"Contact","href":"mailto:ntmanh@ntmanh.io.vn","variant":"primary"},{"key":"github","label":"GitHub","href":"https://github.com/ntmanh","variant":"secondary"}]}'::jsonb),
('sit-hero-ru','item-hero','ru','Нгуен Тхань Манх','Senior Full-Stack инженер, Next.js / Prisma / PostgreSQL JSONB','Проектирует data-driven веб‑системы, отвечает за архитектуру и скорость поставки функционала, наставляет команду.','{"location":"Дананг, Вьетнам · Удаленно","availability":"Открыт для backend/full-stack задач","highlights":[{"label":"Архитектура на данных","icon":"database"},{"label":"Быстрая поставка с контролем качества","icon":"bolt"},{"label":"Менторинг и гайдлайны","icon":"sparkles"}],"actions":[{"key":"contact","label":"Связаться","href":"mailto:ntmanh@ntmanh.io.vn","variant":"primary"},{"key":"github","label":"GitHub","href":"https://github.com/ntmanh","variant":"secondary"}]}'::jsonb),
-- socials
('sit-social-github-vi','item-social-github','vi','Github','@ntmanh',NULL,NULL),
('sit-social-github-en','item-social-github','en','GitHub','@ntmanh',NULL,NULL),
('sit-social-github-ru','item-social-github','ru','GitHub','@ntmanh',NULL,NULL),
('sit-social-linkedin-vi','item-social-linkedin','vi','LinkedIn','Kết nối',NULL,NULL),
('sit-social-linkedin-en','item-social-linkedin','en','LinkedIn','Connect',NULL,NULL),
('sit-social-linkedin-ru','item-social-linkedin','ru','LinkedIn','Связаться',NULL,NULL),
('sit-social-email-vi','item-social-email','vi','Email','ntmanh@ntmanh.io.vn',NULL,NULL),
('sit-social-email-en','item-social-email','en','Email','ntmanh@ntmanh.io.vn',NULL,NULL),
('sit-social-email-ru','item-social-email','ru','Email','ntmanh@ntmanh.io.vn',NULL,NULL),
('sit-social-web-vi','item-social-web','vi','Website','ntmanh.dev',NULL,NULL),
('sit-social-web-en','item-social-web','en','Website','ntmanh.dev',NULL,NULL),
('sit-social-web-ru','item-social-web','ru','Сайт','ntmanh.dev',NULL,NULL),
-- skills
('sit-skill-backend-vi','item-skill-backend','vi','Backend',NULL,NULL,NULL),
('sit-skill-backend-en','item-skill-backend','en','Backend',NULL,NULL,NULL),
('sit-skill-backend-ru','item-skill-backend','ru','Бэкенд',NULL,NULL,NULL),
('sit-skill-frontend-vi','item-skill-frontend','vi','Frontend',NULL,NULL,NULL),
('sit-skill-frontend-en','item-skill-frontend','en','Frontend',NULL,NULL,NULL),
('sit-skill-frontend-ru','item-skill-frontend','ru','Фронтенд',NULL,NULL,NULL),
('sit-skill-cloud-vi','item-skill-cloud','vi','Cloud & DevOps',NULL,NULL,NULL),
('sit-skill-cloud-en','item-skill-cloud','en','Cloud & DevOps',NULL,NULL,NULL),
('sit-skill-cloud-ru','item-skill-cloud','ru','Облако и DevOps',NULL,NULL,NULL),
('sit-skill-data-vi','item-skill-data','vi','Dữ liệu & Analytics',NULL,NULL,NULL),
('sit-skill-data-en','item-skill-data','en','Data & Analytics',NULL,NULL,NULL),
('sit-skill-data-ru','item-skill-data','ru','Данные и аналитика',NULL,NULL,NULL),
('sit-skill-lead-vi','item-skill-lead','vi','Lãnh đạo kỹ thuật',NULL,NULL,NULL),
('sit-skill-lead-en','item-skill-lead','en','Technical leadership',NULL,NULL,NULL),
('sit-skill-lead-ru','item-skill-lead','ru','Техническое лидерство',NULL,NULL,NULL),
-- experience
('sit-exp-vertex-vi','item-exp-vertex','vi','Senior Full-Stack Engineer','Vertex E-commerce · Remote','Dẫn dắt hiện đại hóa nền tảng thương mại, chuyển sang Next.js App Router và tối ưu truy vấn JSONB.',NULL),
('sit-exp-vertex-en','item-exp-vertex','en','Senior Full-Stack Engineer','Vertex E-commerce · Remote','Led modernization to App Router, stabilized performance, and shaped engineering rituals.',NULL),
('sit-exp-vertex-ru','item-exp-vertex','ru','Senior Full-Stack Engineer','Vertex E-commerce · Удаленно','Руководил миграцией на App Router, оптимизировал производительность и процессы команды.',NULL),
('sit-exp-dnlab-vi','item-exp-dnlab','vi','Full-Stack Engineer','Da Nang Tech Lab · Đà Nẵng','Phát triển sản phẩm SaaS, tối ưu backend và xây dựng hệ thống analytics sự kiện.',NULL),
('sit-exp-dnlab-en','item-exp-dnlab','en','Full-Stack Engineer','Da Nang Tech Lab · Da Nang','Built SaaS features end to end, improved API latency, and shipped analytics foundations.',NULL),
('sit-exp-dnlab-ru','item-exp-dnlab','ru','Full-Stack Engineer','Da Nang Tech Lab · Дананг','Разрабатывал SaaS-функционал, ускорил API и построил событийную аналитику.',NULL),
('sit-exp-freelance-vi','item-exp-freelance','vi','Full-Stack Builder','Freelance','Xây dựng dashboard và trang đích tối ưu SEO cho doanh nghiệp nhỏ, triển khai CI/CD và observability.',NULL),
('sit-exp-freelance-en','item-exp-freelance','en','Full-Stack Builder','Freelance','Delivered dashboards and SEO-first landing pages, wired CI/CD and observability for small teams.',NULL),
('sit-exp-freelance-ru','item-exp-freelance','ru','Full-Stack Builder','Freelance','Создавал дашборды и SEO-лендинги, настраивал CI/CD и мониторинг для небольших команд.',NULL),
-- projects
('sit-proj-cv-vi','item-proj-cv','vi','Nền tảng CV data-driven','Kiến trúc cho hồ sơ đa ngôn ngữ','Thiết kế schema phân tách cấu trúc - nội dung, hỗ trợ i18n và SEO động.',NULL),
('sit-proj-cv-en','item-proj-cv','en','Data-driven CV Platform','Architecture for multilingual profile','Built schema separating structure from content with fully dynamic renderers.',NULL),
('sit-proj-cv-ru','item-proj-cv','ru','Data-driven CV платформа','Архитектура многоязычного профиля','Схема разделяет структуру и контент, UI рендерится динамически.',NULL),
('sit-proj-commerce-vi','item-proj-commerce','vi','Commerce Accelerator','Tối ưu storefront','Triển khai block-based storefront, cache edge và tối ưu SEO.',NULL),
('sit-proj-commerce-en','item-proj-commerce','en','Commerce Accelerator','Storefront optimization','Composable blocks from CMS JSON with edge caching for PDP/PLP.',NULL),
('sit-proj-commerce-ru','item-proj-commerce','ru','Commerce Accelerator','Оптимизация витрины','Блочная витрина от CMS JSON, edge-кэширование PDP/PLP.',NULL),
('sit-proj-learning-vi','item-proj-learning','vi','Learning Analytics','Dashboard hành vi người học','Pipeline sự kiện và dashboard tương tác theo cohort.',NULL),
('sit-proj-learning-en','item-proj-learning','en','Learning Analytics','Learner behavior dashboards','Event pipeline plus drilldown dashboards for instructors.',NULL),
('sit-proj-learning-ru','item-proj-learning','ru','Learning Analytics','Дашборды поведения студентов','Пайплайн событий и интерактивные отчеты для преподавателей.',NULL),
-- education
('sit-edu-main-vi','item-edu-main','vi','ĐH Sư phạm Kỹ thuật – ĐH Đà Nẵng','Kỹ thuật phần mềm','Tập trung web, hệ phân tán và mô hình dữ liệu.',NULL),
('sit-edu-main-en','item-edu-main','en','University of Technology and Education – The University of Danang','Software Engineering','Focus on web engineering, distributed systems, and data modeling.',NULL),
('sit-edu-main-ru','item-edu-main','ru','Университет технологий и образования – Дананг','Программная инженерия','Упор на веб-разработку, распределенные системы и моделирование данных.',NULL)
ON CONFLICT ("sectionItemId","language") DO UPDATE
SET "title" = EXCLUDED."title",
    "subtitle" = EXCLUDED."subtitle",
    "description" = EXCLUDED."description",
    "metadata" = EXCLUDED."metadata";

COMMIT;
