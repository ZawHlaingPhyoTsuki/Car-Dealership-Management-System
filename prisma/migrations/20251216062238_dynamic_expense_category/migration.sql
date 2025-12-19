/*
  Warnings:

  - You are about to drop the column `category` on the `expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expense" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- DropEnum
DROP TYPE "ExpenseCategory";

-- CreateTable
CREATE TABLE "expense_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expense_category_name_key" ON "expense_category"("name");

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
