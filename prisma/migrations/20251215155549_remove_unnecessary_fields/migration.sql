/*
  Warnings:

  - You are about to drop the column `paidAmount` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `paidMethod` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `employee` table. All the data in the column will be lost.
  - Added the required column `percentage` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employee_email_key";

-- AlterTable
ALTER TABLE "car" DROP COLUMN "paidAmount",
DROP COLUMN "paidMethod";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "percentage" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "PaidMethod";
