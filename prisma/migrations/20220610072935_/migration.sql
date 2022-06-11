-- CreateTable
CREATE TABLE "FIlter_Product" (
    "id" SERIAL NOT NULL,
    "product_size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "FIlter_Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FIlter_Product" ADD CONSTRAINT "FIlter_Product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
