/*
  Warnings:

  - You are about to drop the column `loc_zoom` on the `City` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `City`
    DROP COLUMN `loc_zoom`,
    ADD COLUMN `east`  DECIMAL(9, 6) NULL,
    ADD COLUMN `north` DECIMAL(8, 6) NULL,
    ADD COLUMN `south` DECIMAL(8, 6) NULL,
    ADD COLUMN `west`  DECIMAL(9, 6) NULL;
