/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `File` table. All the data in the column will be lost.
  - The `id` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "category",
DROP COLUMN "entityId",
DROP COLUMN "entityType",
DROP COLUMN "ownerId",
DROP COLUMN "visibility",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "regNo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "StudentUploadJob" (
    "id" SERIAL NOT NULL,
    "uploadedBy" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "validRecords" INTEGER NOT NULL DEFAULT 0,
    "invalidRecords" INTEGER NOT NULL DEFAULT 0,
    "insertedRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentUploadJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentVerificationFailure" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "errorReason" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentVerificationFailure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentInsertionFailure" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "email" TEXT,
    "rollNo" TEXT,
    "regNo" TEXT,
    "errorReason" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentInsertionFailure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentUploadJob" ADD CONSTRAINT "StudentUploadJob_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentUploadJob" ADD CONSTRAINT "StudentUploadJob_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentVerificationFailure" ADD CONSTRAINT "StudentVerificationFailure_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "StudentUploadJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentInsertionFailure" ADD CONSTRAINT "StudentInsertionFailure_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "StudentUploadJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
