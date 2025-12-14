-- CreateEnum
CREATE TYPE "Language" AS ENUM ('vi', 'en', 'ru');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileTranslation" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "fullName" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "seoMetadata" JSONB,

    CONSTRAINT "ProfileTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "uiConfig" JSONB NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionTranslation" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "metadata" JSONB,

    CONSTRAINT "SectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionItemTranslation" (
    "id" TEXT NOT NULL,
    "sectionItemId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "metadata" JSONB,

    CONSTRAINT "SectionItemTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileTranslation_profileId_language_key" ON "ProfileTranslation"("profileId", "language");

-- CreateIndex
CREATE INDEX "Section_profileId_displayOrder_idx" ON "Section"("profileId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Section_profileId_key_key" ON "Section"("profileId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "SectionTranslation_sectionId_language_key" ON "SectionTranslation"("sectionId", "language");

-- CreateIndex
CREATE INDEX "SectionItem_sectionId_displayOrder_idx" ON "SectionItem"("sectionId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SectionItemTranslation_sectionItemId_language_key" ON "SectionItemTranslation"("sectionItemId", "language");
