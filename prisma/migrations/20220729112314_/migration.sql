/*
  Warnings:

  - You are about to drop the column `title` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "User_Addresses" ADD COLUMN     "title" TEXT;
