/*
  Warnings:

  - A unique constraint covering the columns `[queue]` on the table `HomeGadget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HomeGadget_queue_key" ON "HomeGadget"("queue");
