-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "description" TEXT,
    "descriptionFa" TEXT,
    "imageUrl" TEXT NOT NULL,
    "buttonOneText" TEXT,
    "buttonOneFa" TEXT,
    "buttonOneLink" TEXT,
    "buttonTwoText" TEXT,
    "buttonTwoFa" TEXT,
    "buttonTwoLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
