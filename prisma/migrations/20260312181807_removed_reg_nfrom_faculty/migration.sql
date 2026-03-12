/*
  Warnings:

  - You are about to drop the column `regNo` on the `Faculty` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Faculty_regNo_key";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "regNo";
