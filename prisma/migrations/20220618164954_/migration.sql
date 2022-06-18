/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "HomeGadget" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "apiUrls" TEXT NOT NULL,
    "imageUrls" TEXT NOT NULL,
    "brandIds" TEXT,
    "productIds" TEXT,
    "swiperBannersCount" INTEGER,
    "queue" SERIAL NOT NULL,

    CONSTRAINT "HomeGadget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");
