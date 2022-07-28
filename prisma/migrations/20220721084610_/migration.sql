-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "GadgetLocation" AS ENUM ('HOME', 'CATEGORY');

-- AlterTable
ALTER TABLE "Gadget" ADD COLUMN     "location" "GadgetLocation" NOT NULL DEFAULT E'HOME',
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT E'INACTIVE';
