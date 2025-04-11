-- CreateTable
CREATE TABLE "Statistic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
