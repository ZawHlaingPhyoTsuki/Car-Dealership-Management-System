/*
  Warnings:

  - You are about to drop the `photo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_carId_fkey";

-- DropTable
DROP TABLE "photo";
