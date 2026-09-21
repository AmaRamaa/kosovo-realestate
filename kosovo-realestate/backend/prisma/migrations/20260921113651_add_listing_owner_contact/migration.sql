-- CreateTable
CREATE TABLE "listing_owner_contacts" (
    "listingId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_owner_contacts_pkey" PRIMARY KEY ("listingId")
);

-- AddForeignKey
ALTER TABLE "listing_owner_contacts" ADD CONSTRAINT "listing_owner_contacts_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
