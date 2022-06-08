-- CreateEnum
CREATE TYPE "FilterType" AS ENUM ('COLOR', 'GENDER', 'SIZE');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name_tm" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "color_id" INTEGER NOT NULL,
    "gender_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "description_tm" TEXT,
    "description_ru" TEXT,
    "brand_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "market_id" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" SERIAL NOT NULL,
    "name_tm" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "type" "FilterType" NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "Market"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
