-- CreateTable
CREATE TABLE "FeatureItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionFa" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeatureItem" ADD CONSTRAINT "FeatureItem_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
