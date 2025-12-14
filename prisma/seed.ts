import { PrismaClient, Language, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type LangRecord<T> = Record<Language, T>;
const asJson = (value?: Record<string, unknown>): Prisma.InputJsonValue =>
  (value ?? {}) as Prisma.InputJsonValue;

const languages: Language[] = [Language.vi, Language.en, Language.ru];

const profileTranslations: LangRecord<{
  fullName: string;
  headline: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoMetadata: Prisma.InputJsonValue;
}> = {
  [Language.vi]: {
    fullName: "Nguyễn Thành Mạnh",
    headline: "Senior Full-Stack Engineer · Next.js · Prisma · PostgreSQL",
    summary:
      "Xây dựng hệ thống web hướng dữ liệu, tối ưu hiệu năng và hỗ trợ nhóm shipping nhanh mà vẫn kiểm soát kiến trúc.",
    seoTitle: "Nguyễn Thành Mạnh | Senior Full-Stack Engineer",
    seoDescription:
      "Senior Full-Stack Engineer tập trung Next.js, Prisma, PostgreSQL. Chuyên thiết kế kiến trúc data-driven, tối ưu JSONB và mở rộng tính năng nhanh.",
    seoKeywords: [
      "Nguyễn Thành Mạnh",
      "Full-Stack Engineer",
      "Next.js CV",
      "Prisma",
      "PostgreSQL",
    ],
    seoMetadata: {
      openGraph: {
        type: "profile",
      },
    },
  },
  [Language.en]: {
    fullName: "Nguyễn Thành Mạnh",
    headline:
      "Senior Full-Stack Engineer focused on Next.js, Prisma, PostgreSQL",
    summary:
      "Designs data-first architectures, ships resilient web products end to end, and mentors teams to deliver faster with guardrails.",
    seoTitle: "Nguyễn Thành Mạnh | Senior Full-Stack Engineer",
    seoDescription:
      "Senior Full-Stack Engineer specialized in Next.js App Router, Prisma ORM, and PostgreSQL JSONB. Builds scalable, content-driven experiences.",
    seoKeywords: [
      "Nguyen Thanh Manh",
      "Full-Stack Next.js",
      "Prisma engineer",
      "PostgreSQL JSONB",
      "Data driven CV",
    ],
    seoMetadata: {
      openGraph: {
        type: "profile",
      },
    },
  },
  [Language.ru]: {
    fullName: "Нгуен Тхань Манх",
    headline:
      "Senior Full-Stack инженер, Next.js / Prisma / PostgreSQL JSONB",
    summary:
      "Проектирует data-driven веб‑системы, отвечает за архитектуру и скорость поставки функционала, наставляет команду.",
    seoTitle: "Нгуен Тхань Манх | Senior Full-Stack инженер",
    seoDescription:
      "Senior Full-Stack инженер, специализация Next.js, Prisma и PostgreSQL JSONB. Строит масштабируемые продукты и контентные платформы.",
    seoKeywords: [
      "Нгуен Тхань Манх",
      "Full-Stack инженер",
      "Next.js",
      "Prisma",
      "PostgreSQL",
    ],
    seoMetadata: {
      openGraph: {
        type: "profile",
      },
    },
  },
};

type SectionSeed = {
  key: string;
  displayOrder: number;
  isActive?: boolean;
  uiConfig: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  translations: LangRecord<{
    title: string;
    subtitle?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }>;
  items: Array<{
    itemType: string;
    displayOrder: number;
    isActive?: boolean;
    metadata: Record<string, unknown>;
    translations: LangRecord<{
      title?: string;
      subtitle?: string;
      description?: string;
      metadata?: Record<string, unknown>;
    }>;
  }>;
};

const sections: SectionSeed[] = [
  {
    key: "hero",
    displayOrder: 1,
    uiConfig: {
      variant: "hero",
      columns: 2,
      accent: "emerald",
      background: "grid",
    },
    metadata: {
      stats: [
        { label: "Projects shipped", value: "15+" },
        { label: "Production users", value: "1M+" },
        { label: "Team size", value: "4-6 devs" },
      ],
    },
    translations: {
      [Language.vi]: {
        title: "Giới thiệu",
        subtitle: "Ảnh chụp nhanh về hồ sơ",
        description:
          "Tập trung xây dựng nền tảng data-driven, tối ưu trải nghiệm người dùng và giữ kiến trúc gọn gàng để scale dài hạn.",
      },
      [Language.en]: {
        title: "Overview",
        subtitle: "Snapshot of the profile",
        description:
          "Data-first engineering with a focus on resilient delivery, measurable impact, and long-term maintainability.",
      },
      [Language.ru]: {
        title: "Обзор",
        subtitle: "Быстрое резюме профиля",
        description:
          "Data-driven подход, устойчивые поставки и архитектура, которую легко сопровождать и масштабировать.",
      },
    },
    items: [
      {
        itemType: "hero",
        displayOrder: 1,
        metadata: {
          highlights: [
            {
              label: "Data-driven UI & content architecture",
              icon: "database",
            },
            { label: "Ships fast with clean domain boundaries", icon: "rocket" },
            {
              label: "Coaches squads and leads engineering rituals",
              icon: "users",
            },
          ],
          actions: [
            {
              key: "contact",
              href: "mailto:ntmanh@ntmanh.io.vn",
              variant: "primary",
            },
            {
              key: "github",
              href: "https://github.com/ManhDevFull",
              variant: "ghost",
            },
          ],
          tags: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
        },
        translations: {
          [Language.vi]: {
            title: profileTranslations[Language.vi].fullName,
            subtitle: profileTranslations[Language.vi].headline,
            description: profileTranslations[Language.vi].summary,
            metadata: {
              location: "Đà Nẵng, Việt Nam · Remote",
              availability: "Sẵn sàng cho dự án backend/full-stack",
              highlights: [
                {
                  label: "Kiến trúc data-driven, dễ mở rộng",
                  icon: "database",
                },
                { label: "Triển khai nhanh, code rõ ràng", icon: "bolt" },
                { label: "Mentor & review chất lượng", icon: "sparkles" },
              ],
              actions: [
                {
                  key: "contact",
                  label: "Liên hệ",
                  href: "mailto:ntmanh@ntmanh.io.vn",
                  variant: "primary",
                },
                {
                  key: "github",
                  label: "Github",
                  href: "https://github.com/ManhDevFull",
                  variant: "secondary",
                },
              ],
            },
          },
          [Language.en]: {
            title: profileTranslations[Language.en].fullName,
            subtitle: profileTranslations[Language.en].headline,
            description: profileTranslations[Language.en].summary,
            metadata: {
              location: "Da Nang, Viet Nam · Remote",
              availability: "Open for backend/full-stack engagements",
              highlights: [
                { label: "Data-driven architecture", icon: "database" },
                { label: "Rapid delivery with guardrails", icon: "bolt" },
                { label: "Mentorship & documentation", icon: "book-open" },
              ],
              actions: [
                {
                  key: "contact",
                  label: "Contact",
                  href: "mailto:ntmanh@ntmanh.io.vn",
                  variant: "primary",
                },
                {
                  key: "github",
                  label: "GitHub",
                  href: "https://github.com/ManhDevFull",
                  variant: "secondary",
                },
              ],
            },
          },
          [Language.ru]: {
            title: profileTranslations[Language.ru].fullName,
            subtitle: profileTranslations[Language.ru].headline,
            description: profileTranslations[Language.ru].summary,
            metadata: {
              location: "Дананг, Вьетнам · Удаленно",
              availability: "Открыт для backend/full-stack задач",
              highlights: [
                { label: "Архитектура на данных", icon: "database" },
                { label: "Быстрая поставка с контролем качества", icon: "bolt" },
                { label: "Менторинг и гайдлайны", icon: "sparkles" },
              ],
              actions: [
                {
                  key: "contact",
                  label: "Связаться",
                  href: "mailto:ntmanh@ntmanh.io.vn",
                  variant: "primary",
                },
                {
                  key: "github",
                  label: "GitHub",
                  href: "https://github.com/ManhDevFull",
                  variant: "secondary",
                },
              ],
            },
          },
        },
      },
    ],
  },
  {
    key: "socials",
    displayOrder: 2,
    uiConfig: {
      variant: "icons",
      columns: 4,
      minimal: true,
    },
    translations: {
      [Language.vi]: {
        title: "Kết nối",
        subtitle: "Liên hệ & mạng xã hội",
      },
      [Language.en]: {
        title: "Connect",
        subtitle: "Social and contact channels",
      },
      [Language.ru]: {
        title: "Контакты",
        subtitle: "Соцсети и связь",
      },
    },
    items: [
      {
        itemType: "social_link",
        displayOrder: 1,
        metadata: {
          platform: "GitHub",
          url: "https://github.com/ManhDevFull",
          icon: "github",
          username: "ManhDevFull",
        },
        translations: {
          [Language.vi]: { title: "Github", subtitle: "@ManhDevFull" },
          [Language.en]: { title: "GitHub", subtitle: "@ManhDevFull" },
          [Language.ru]: { title: "GitHub", subtitle: "@ManhDevFull" },
        },
      },
      {
        itemType: "social_link",
        displayOrder: 2,
        metadata: {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/ntmanh",
          icon: "linkedin",
          username: "ntmanh",
        },
        translations: {
          [Language.vi]: { title: "LinkedIn", subtitle: "Kết nối" },
          [Language.en]: { title: "LinkedIn", subtitle: "Connect" },
          [Language.ru]: { title: "LinkedIn", subtitle: "Связаться" },
        },
      },
      {
        itemType: "social_link",
        displayOrder: 3,
        metadata: {
          platform: "Email",
          url: "mailto:ntmanh@ntmanh.io.vn",
          icon: "mail",
          username: "ntmanh@ntmanh.io.vn",
        },
        translations: {
          [Language.vi]: { title: "Email", subtitle: "ntmanh@ntmanh.io.vn" },
          [Language.en]: { title: "Email", subtitle: "ntmanh@ntmanh.io.vn" },
          [Language.ru]: { title: "Email", subtitle: "ntmanh@ntmanh.io.vn" },
        },
      },
      {
        itemType: "social_link",
        displayOrder: 4,
        metadata: {
          platform: "Website",
          url: "https://ntmanh.dev",
          icon: "globe",
          username: "ntmanh.dev",
        },
        translations: {
          [Language.vi]: { title: "Website", subtitle: "ntmanh.dev" },
          [Language.en]: { title: "Website", subtitle: "ntmanh.dev" },
          [Language.ru]: { title: "Сайт", subtitle: "ntmanh.dev" },
        },
      },
    ],
  },
  {
    key: "skills",
    displayOrder: 3,
    uiConfig: {
      variant: "badges",
      columns: 3,
      showMetadataKeys: ["keywords", "level"],
    },
    translations: {
      [Language.vi]: {
        title: "Kỹ năng",
        subtitle: "Nhóm kỹ năng chính",
      },
      [Language.en]: {
        title: "Skills",
        subtitle: "Core capabilities",
      },
      [Language.ru]: {
        title: "Навыки",
        subtitle: "Основные компетенции",
      },
    },
    items: [
      {
        itemType: "skill",
        displayOrder: 1,
        metadata: {
          category: "Backend",
          level: "Advanced",
          keywords: [
            "Node.js",
            "Next.js API",
            ".NET Core",
            "Prisma",
            "PostgreSQL",
            "Redis",
          ],
        },
        translations: {
          [Language.vi]: { title: "Backend" },
          [Language.en]: { title: "Backend" },
          [Language.ru]: { title: "Бэкенд" },
        },
      },
      {
        itemType: "skill",
        displayOrder: 2,
        metadata: {
          category: "Frontend",
          level: "Advanced",
          keywords: [
            "React Server Components",
            "Next.js App Router",
            "Tailwind CSS",
            "TypeScript",
            "Design systems",
            "Accessibility",
          ],
        },
        translations: {
          [Language.vi]: { title: "Frontend" },
          [Language.en]: { title: "Frontend" },
          [Language.ru]: { title: "Фронтенд" },
        },
      },
      {
        itemType: "skill",
        displayOrder: 3,
        metadata: {
          category: "Cloud & DevOps",
          level: "Intermediate",
          keywords: [
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Aiven",
            "Vercel",
            "Grafana",
          ],
        },
        translations: {
          [Language.vi]: { title: "Cloud & DevOps" },
          [Language.en]: { title: "Cloud & DevOps" },
          [Language.ru]: { title: "Облако и DevOps" },
        },
      },
      {
        itemType: "skill",
        displayOrder: 4,
        metadata: {
          category: "Data & Analytics",
          level: "Intermediate",
          keywords: [
            "JSONB modeling",
            "Query optimization",
            "ETL",
            "dbt",
            "Event analytics",
          ],
        },
        translations: {
          [Language.vi]: { title: "Dữ liệu & Analytics" },
          [Language.en]: { title: "Data & Analytics" },
          [Language.ru]: { title: "Данные и аналитика" },
        },
      },
      {
        itemType: "skill",
        displayOrder: 5,
        metadata: {
          category: "Leadership",
          level: "Senior",
          keywords: [
            "Technical leadership",
            "Mentoring",
            "Code review",
            "Backlog shaping",
            "Documentation",
          ],
        },
        translations: {
          [Language.vi]: { title: "Lãnh đạo kỹ thuật" },
          [Language.en]: { title: "Technical leadership" },
          [Language.ru]: { title: "Техническое лидерство" },
        },
      },
    ],
  },
  {
    key: "experience",
    displayOrder: 4,
    uiConfig: {
      variant: "timeline",
      columns: 1,
      accent: "emerald",
      showMetadataKeys: ["company", "location", "startDate", "endDate", "techStack"],
    },
    translations: {
      [Language.vi]: {
        title: "Kinh nghiệm",
        subtitle: "Hành trình nghề nghiệp",
      },
      [Language.en]: {
        title: "Experience",
        subtitle: "Career journey",
      },
      [Language.ru]: {
        title: "Опыт",
        subtitle: "Профессиональный путь",
      },
    },
    items: [
      {
        itemType: "job",
        displayOrder: 1,
        metadata: {
          company: "Vertex E-commerce",
          role: "Senior Full-Stack Engineer",
          location: "Remote",
          startDate: "2024-01",
          endDate: null,
          techStack: ["Next.js", "Prisma", "PostgreSQL", ".NET", "Docker"],
          achievements: [
            "Rebuilt storefront to App Router and server components",
            "Cut render time 35% via JSONB driven caching",
            "Mentored 4 engineers, codified review checklists",
          ],
        },
        translations: {
          [Language.vi]: {
            title: "Senior Full-Stack Engineer",
            subtitle: "Vertex E-commerce · Remote",
            description:
              "Dẫn dắt hiện đại hóa nền tảng thương mại, chuyển sang Next.js App Router và tối ưu truy vấn JSONB.",
          },
          [Language.en]: {
            title: "Senior Full-Stack Engineer",
            subtitle: "Vertex E-commerce · Remote",
            description:
              "Led modernization to App Router, stabilized performance, and shaped engineering rituals.",
          },
          [Language.ru]: {
            title: "Senior Full-Stack Engineer",
            subtitle: "Vertex E-commerce · Удаленно",
            description:
              "Руководил миграцией на App Router, оптимизировал производительность и процессы команды.",
          },
        },
      },
      {
        itemType: "job",
        displayOrder: 2,
        metadata: {
          company: "Da Nang Tech Lab",
          role: "Full-Stack Engineer",
          location: "Da Nang, Viet Nam",
          startDate: "2022-06",
          endDate: "2023-12",
          techStack: ["Next.js", "Express", "PostgreSQL", "Redis"],
          achievements: [
            "Implemented modular design system for marketing sites",
            "Reduced cold-start latency for APIs by 25%",
            "Built analytics events pipeline for product metrics",
          ],
        },
        translations: {
          [Language.vi]: {
            title: "Full-Stack Engineer",
            subtitle: "Da Nang Tech Lab · Đà Nẵng",
            description:
              "Phát triển sản phẩm SaaS, tối ưu backend và xây dựng hệ thống analytics sự kiện.",
          },
          [Language.en]: {
            title: "Full-Stack Engineer",
            subtitle: "Da Nang Tech Lab · Da Nang",
            description:
              "Built SaaS features end to end, improved API latency, and shipped analytics foundations.",
          },
          [Language.ru]: {
            title: "Full-Stack Engineer",
            subtitle: "Da Nang Tech Lab · Дананг",
            description:
              "Разрабатывал SaaS-функционал, ускорил API и построил событийную аналитику.",
          },
        },
      },
      {
        itemType: "job",
        displayOrder: 3,
        metadata: {
          company: "Freelance",
          role: "Full-Stack Builder",
          location: "Remote",
          startDate: "2021-01",
          endDate: "2022-05",
          techStack: ["Next.js", "Supabase", "Tailwind", "Vercel"],
          achievements: [
            "Delivered custom dashboards for SMEs",
            "Set up CI/CD and observability for small teams",
          ],
        },
        translations: {
          [Language.vi]: {
            title: "Full-Stack Builder",
            subtitle: "Freelance",
            description:
              "Xây dựng dashboard và trang đích tối ưu SEO cho doanh nghiệp nhỏ, triển khai CI/CD và observability.",
          },
          [Language.en]: {
            title: "Full-Stack Builder",
            subtitle: "Freelance",
            description:
              "Delivered dashboards and SEO-first landing pages, wired CI/CD and observability for small teams.",
          },
          [Language.ru]: {
            title: "Full-Stack Builder",
            subtitle: "Freelance",
            description:
              "Создавал дашборды и SEO-лендинги, настраивал CI/CD и мониторинг для небольших команд.",
          },
        },
      },
    ],
  },
  {
    key: "projects",
    displayOrder: 5,
    uiConfig: {
      variant: "cards",
      columns: 2,
      emphasize: "impact",
    },
    translations: {
      [Language.vi]: {
        title: "Dự án tiêu biểu",
        subtitle: "Một vài sản phẩm gần đây",
      },
      [Language.en]: {
        title: "Highlighted Projects",
        subtitle: "Recent, representative work",
      },
      [Language.ru]: {
        title: "Проекты",
        subtitle: "Последние значимые работы",
      },
    },
    items: [
      {
        itemType: "project",
        displayOrder: 1,
        metadata: {
          key: "cv-platform",
          links: [
            {
              label: "Repository",
              href: "https://github.com/ntmanh/data-driven-cv",
            },
          ],
          techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind", "RSC"],
          highlights: [
            "DB-driven profile schema with JSONB metadata",
            "Generic renderers keyed by uiConfig.variant",
            "SEO metadata sourced from translations",
          ],
          impact:
            "New sections can be added via inserts only; zero code changes required.",
        },
        translations: {
          [Language.vi]: {
            title: "Nền tảng CV data-driven",
            subtitle: "Kiến trúc cho hồ sơ đa ngôn ngữ",
            description:
              "Thiết kế schema phân tách cấu trúc - nội dung, hỗ trợ i18n và SEO động.",
          },
          [Language.en]: {
            title: "Data-driven CV Platform",
            subtitle: "Architecture for multilingual profile",
            description:
              "Built schema separating structure from content with fully dynamic renderers.",
          },
          [Language.ru]: {
            title: "Data-driven CV платформа",
            subtitle: "Архитектура многоязычного профиля",
            description:
              "Схема разделяет структуру и контент, UI рендерится динамически.",
          },
        },
      },
      {
        itemType: "project",
        displayOrder: 2,
        metadata: {
          key: "commerce-accelerator",
          links: [
            { label: "Case study", href: "https://ntmanh.dev/case/commerce" },
          ],
          techStack: ["Next.js", "Edge runtime", "Redis cache", "Storyblok"],
          highlights: [
            "Composable blocks mapped from CMS JSON",
            "Edge caching strategy for product detail pages",
          ],
          impact:
            "Reduced TTFB by 32% and enabled marketers to ship pages without code.",
        },
        translations: {
          [Language.vi]: {
            title: "Commerce Accelerator",
            subtitle: "Tối ưu storefront",
            description:
              "Triển khai block-based storefront, cache edge và tối ưu SEO.",
          },
          [Language.en]: {
            title: "Commerce Accelerator",
            subtitle: "Storefront optimization",
            description:
              "Composable blocks from CMS JSON with edge caching for PDP/PLP.",
          },
          [Language.ru]: {
            title: "Commerce Accelerator",
            subtitle: "Оптимизация витрины",
            description:
              "Блочная витрина от CMS JSON, edge-кэширование PDP/PLP.",
          },
        },
      },
      {
        itemType: "project",
        displayOrder: 3,
        metadata: {
          key: "learning-analytics",
          links: [
            { label: "Demo", href: "https://ntmanh.dev/demo/learning" },
          ],
          techStack: ["Next.js", "ClickHouse", "Drizzle ETL", "Tailwind"],
          highlights: [
            "Event ingestion pipeline with dbt-style models",
            "Interactive dashboards with drilldowns",
          ],
          impact: "Surfaced learner health metrics to instructors weekly.",
        },
        translations: {
          [Language.vi]: {
            title: "Learning Analytics",
            subtitle: "Dashboard hành vi người học",
            description:
              "Pipeline sự kiện và dashboard tương tác theo cohort.",
          },
          [Language.en]: {
            title: "Learning Analytics",
            subtitle: "Learner behavior dashboards",
            description:
              "Event pipeline plus drilldown dashboards for instructors.",
          },
          [Language.ru]: {
            title: "Learning Analytics",
            subtitle: "Дашборды поведения студентов",
            description:
              "Пайплайн событий и интерактивные отчеты для преподавателей.",
          },
        },
      },
    ],
  },
  {
    key: "education",
    displayOrder: 6,
    uiConfig: {
      variant: "list",
      columns: 1,
    },
    translations: {
      [Language.vi]: {
        title: "Học vấn",
        subtitle: "Nền tảng học thuật",
      },
      [Language.en]: {
        title: "Education",
        subtitle: "Academic foundation",
      },
      [Language.ru]: {
        title: "Образование",
        subtitle: "Академическая база",
      },
    },
    items: [
      {
        itemType: "education",
        displayOrder: 1,
        metadata: {
          school:
            "Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng (University of Technology and Education – The University of Danang)",
          degree: "Software Engineering",
          startDate: "2023-09",
          endDate: null,
          focus: ["Web engineering", "Distributed systems", "Data modeling"],
        },
        translations: {
          [Language.vi]: {
            title:
              "ĐH Sư phạm Kỹ thuật – ĐH Đà Nẵng",
            subtitle: "Kỹ thuật phần mềm",
            description:
              "Tập trung web, hệ phân tán và mô hình dữ liệu.",
          },
          [Language.en]: {
            title:
              "University of Technology and Education – The University of Danang",
            subtitle: "Software Engineering",
            description:
              "Focus on web engineering, distributed systems, and data modeling.",
          },
          [Language.ru]: {
            title:
              "Университет технологий и образования – Дананг",
            subtitle: "Программная инженерия",
            description:
              "Упор на веб-разработку, распределенные системы и моделирование данных.",
          },
        },
      },
    ],
  },
];
async function main() {
  const profileSlug = "nguyen-thanh-manh";

  // Clean existing profile data to allow re-seeding without duplicates.
  await prisma.sectionItemTranslation.deleteMany({
    where: { sectionItem: { section: { profile: { slug: profileSlug } } } },
  });
  await prisma.sectionItem.deleteMany({
    where: { section: { profile: { slug: profileSlug } } },
  });
  await prisma.sectionTranslation.deleteMany({
    where: { section: { profile: { slug: profileSlug } } },
  });
  await prisma.section.deleteMany({ where: { profile: { slug: profileSlug } } });
  await prisma.profileTranslation.deleteMany({
    where: { profile: { slug: profileSlug } },
  });
  await prisma.profile.deleteMany({ where: { slug: profileSlug } });

  const profile = await prisma.profile.create({
    data: {
      slug: profileSlug,
      level: "Senior",
      dateOfBirth: new Date("2005-11-18"),
      metadata: asJson({
        cvLevel: "Senior",
        location: "Da Nang, Viet Nam",
        focus: ["Next.js", "Prisma", "PostgreSQL", "System design"],
        availability: "Open for backend/full-stack roles",
      }),
      translations: {
        create: languages.map((language) => {
          const t = profileTranslations[language];
          return {
            language,
            fullName: t.fullName,
            headline: t.headline,
            summary: t.summary,
            seoTitle: t.seoTitle,
            seoDescription: t.seoDescription,
            seoKeywords: t.seoKeywords,
            seoMetadata: t.seoMetadata as Prisma.InputJsonValue,
          };
        }),
      },
    },
  });

  for (const sectionSeed of sections) {
    await prisma.section.create({
      data: {
        profileId: profile.id,
        key: sectionSeed.key,
        displayOrder: sectionSeed.displayOrder,
        isActive: sectionSeed.isActive ?? true,
        uiConfig: asJson(sectionSeed.uiConfig),
        metadata: asJson(sectionSeed.metadata),
        translations: {
          create: languages.map((language) => {
            const t = sectionSeed.translations[language];
            return {
              language,
              title: t.title,
              subtitle: t.subtitle,
              description: t.description,
              metadata: asJson(t.metadata),
            };
          }),
        },
        items: {
          create: sectionSeed.items.map((item) => ({
            itemType: item.itemType,
            displayOrder: item.displayOrder,
            isActive: item.isActive ?? true,
            metadata: asJson(item.metadata),
            translations: {
              create: languages.map((language) => {
                const t = item.translations[language];
                return {
                  language,
                  title: t.title ?? null,
                  subtitle: t.subtitle ?? null,
                  description: t.description ?? null,
                  metadata: asJson(t.metadata),
                };
              }),
            },
          })),
        },
      },
    });
  }

  console.log("Seeded profile and sections for", profileSlug);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
