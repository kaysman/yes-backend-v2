/*
  Warnings:

  - You are about to drop the column `image` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Brand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "image",
DROP COLUMN "logo";
