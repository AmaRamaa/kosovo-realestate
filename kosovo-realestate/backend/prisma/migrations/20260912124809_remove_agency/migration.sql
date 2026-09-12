/*
  Warnings:

  - You are about to drop the column `agencyId` on the `agents` table. All the data in the column will be lost.
  - You are about to drop the column `agencyId` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `agencyId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `agencies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "agencies" DROP CONSTRAINT "agencies_cityId_fkey";

-- DropForeignKey
ALTER TABLE "agents" DROP CONSTRAINT "agents_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "listings" DROP CONSTRAINT "listings_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_agencyId_fkey";

-- AlterTable
ALTER TABLE "agents" DROP COLUMN "agencyId";

-- AlterTable
ALTER TABLE "listings" DROP COLUMN "agencyId";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "agencyId";

-- DropTable
DROP TABLE "agencies";
