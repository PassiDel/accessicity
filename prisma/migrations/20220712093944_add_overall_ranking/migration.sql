-- CreateTable
CREATE TABLE `OverallRanking`
(
    `cityId` INTEGER       NOT NULL,
    `value`  DECIMAL(6, 5) NOT NULL,

    UNIQUE INDEX `OverallRanking_cityId_key` (`cityId`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OverallRanking`
    ADD CONSTRAINT `OverallRanking_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
