/*
  Warnings:

  - You are about to drop the column `logo` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the `CategoryToBag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HomeSquareSizedCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryToBag" DROP CONSTRAINT "CategoryToBag_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "HomeSquareSizedCategory" DROP CONSTRAINT "HomeSquareSizedCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MenuCategory" DROP CONSTRAINT "MenuCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "logo";

-- DropTable
DROP TABLE "CategoryToBag";

-- DropTable
DROP TABLE "HomeSquareSizedCategory";

-- DropTable
DROP TABLE "MenuCategory";
