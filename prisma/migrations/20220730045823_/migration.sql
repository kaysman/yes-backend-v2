-- CreateTable
CREATE TABLE "Gadget_Categories" (
    "gadgetId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Gadget_Categories_pkey" PRIMARY KEY ("gadgetId","categoryId")
);

-- AddForeignKey
ALTER TABLE "Gadget_Categories" ADD CONSTRAINT "Gadget_Categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gadget_Categories" ADD CONSTRAINT "Gadget_Categories_gadgetId_fkey" FOREIGN KEY ("gadgetId") REFERENCES "Gadget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
