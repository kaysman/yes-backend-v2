/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `marketPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ourPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "marketPrice" TEXT NOT NULL,
ADD COLUMN     "ourPrice" TEXT NOT NULL;
