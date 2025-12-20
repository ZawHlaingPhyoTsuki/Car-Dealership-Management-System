/*
  Warnings:

  - You are about to drop the column `color` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `shareholder` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "shareholder_email_key";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "shareholder" DROP COLUMN "email";
