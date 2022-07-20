/*
  Warnings:

  - You are about to drop the `Filter_Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Filter_Product" DROP CONSTRAINT "Filter_Product_product_id_fkey";

-- DropTable
DROP TABLE "Filter_Product";

-- CreateTable
CREATE TABLE "Product_Sizes" (
    "size_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_Sizes_pkey" PRIMARY KEY ("size_id","product_id")
);

-- AddForeignKey
ALTER TABLE "Product_Sizes" ADD CONSTRAINT "Product_Sizes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
