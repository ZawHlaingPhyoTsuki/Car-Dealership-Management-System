/*
  Warnings:

  - You are about to drop the column `role` on the `employee` table. All the data in the column will be lost.
  - Added the required column `position` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" DROP COLUMN "role",
ADD COLUMN     "position" TEXT NOT NULL;
