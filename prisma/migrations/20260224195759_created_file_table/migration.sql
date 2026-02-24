-- CreateEnum
CREATE TYPE "FileVisibility" AS ENUM ('PRIVATE', 'ENROLLED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('ADMISSION', 'ATTENDANCE', 'COURSE', 'ASSIGNMENT', 'QUIZ');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER,
    "uploadedBy" INTEGER NOT NULL,
    "ownerId" INTEGER,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "visibility" "FileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_s3Key_key" ON "File"("s3Key");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
