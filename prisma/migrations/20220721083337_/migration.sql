/*
  Warnings:

  - The primary key for the `Product_Images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Product_Images` table. All the data in the column will be lost.
  - You are about to drop the `HomeGadget` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Product_Images" DROP CONSTRAINT "Product_Images_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Product_Images_pkey" PRIMARY KEY ("image", "productId");

-- DropTable
DROP TABLE "HomeGadget";

-- CreateTable
CREATE TABLE "Gadget" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "queue" INTEGER NOT NULL,

    CONSTRAINT "Gadget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gadget_Images" (
    "gadgetId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gadget_Images_pkey" PRIMARY KEY ("image","gadgetId")
);

-- CreateTable
CREATE TABLE "Gadget_Links" (
    "gadgetId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Gadget_Links_pkey" PRIMARY KEY ("link","gadgetId")
);

-- CreateTable
CREATE TABLE "Gadget_Products" (
    "gadgetId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Gadget_Products_pkey" PRIMARY KEY ("gadgetId","productId")
);

-- AddForeignKey
ALTER TABLE "Gadget_Images" ADD CONSTRAINT "Gadget_Images_gadgetId_fkey" FOREIGN KEY ("gadgetId") REFERENCES "Gadget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gadget_Links" ADD CONSTRAINT "Gadget_Links_gadgetId_fkey" FOREIGN KEY ("gadgetId") REFERENCES "Gadget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gadget_Products" ADD CONSTRAINT "Gadget_Products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gadget_Products" ADD CONSTRAINT "Gadget_Products_gadgetId_fkey" FOREIGN KEY ("gadgetId") REFERENCES "Gadget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
