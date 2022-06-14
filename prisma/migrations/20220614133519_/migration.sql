/*
  Warnings:

  - Changed the type of `marketPrice` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ourPrice` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "marketPrice",
ADD COLUMN     "marketPrice" INTEGER NOT NULL,
DROP COLUMN "ourPrice",
ADD COLUMN     "ourPrice" INTEGER NOT NULL;
