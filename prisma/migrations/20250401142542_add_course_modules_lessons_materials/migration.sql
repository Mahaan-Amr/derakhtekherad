-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('DOCUMENT', 'VIDEO', 'AUDIO', 'LINK', 'OTHER');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "thumbnail" TEXT;

-- CreateTable
CREATE TABLE "CourseModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "description" TEXT,
    "descriptionFa" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentFa" TEXT NOT NULL,
    "duration" INTEGER,
    "orderIndex" INTEGER NOT NULL,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "description" TEXT,
    "descriptionFa" TEXT,
    "type" "MaterialType" NOT NULL,
    "url" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseModule" ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
