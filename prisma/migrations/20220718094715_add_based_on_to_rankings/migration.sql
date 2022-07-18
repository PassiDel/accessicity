-- AlterTable
ALTER TABLE `OverallRanking`
    ADD COLUMN `basedOn` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Ranking`
    ADD COLUMN `basedOn` INTEGER NOT NULL DEFAULT 0;
