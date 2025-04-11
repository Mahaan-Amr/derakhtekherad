/*
  Warnings:

  - Added the required column `updatedAt` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "gradedAt" TIMESTAMP(3),
ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
