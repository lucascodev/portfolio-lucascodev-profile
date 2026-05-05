-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL,
    "heroGreeting" TEXT NOT NULL,
    "heroName" TEXT NOT NULL,
    "heroRole" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "heroTags" JSONB NOT NULL DEFAULT '[]',
    "aboutTitle" TEXT NOT NULL,
    "aboutParagraph1" TEXT NOT NULL,
    "aboutParagraph2" TEXT NOT NULL,
    "aboutTags" JSONB NOT NULL DEFAULT '[]',
    "footerBio" TEXT NOT NULL,
    "footerNavLinks" JSONB NOT NULL DEFAULT '[]',
    "footerSocialLinks" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
