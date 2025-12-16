-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_carId_fkey";

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
