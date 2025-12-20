/*
  Warnings:

  - You are about to drop the column `color` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `shareholder` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "shareholder_email_key";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "color",
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "shareholderPercentage" SET DEFAULT 0,
ALTER COLUMN "investmentAmount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "salary" DROP NOT NULL,
ALTER COLUMN "salary" SET DEFAULT 0,
ALTER COLUMN "percentage" DROP NOT NULL,
ALTER COLUMN "percentage" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "expense" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shareholder" DROP COLUMN "email";
