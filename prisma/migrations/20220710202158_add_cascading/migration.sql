-- This is an empty migration.

-- AddForeignKey
ALTER TABLE `UserDisability`
    DROP CONSTRAINT `UserDisability_userId_fkey`;
ALTER TABLE `UserDisability`
    ADD CONSTRAINT `UserDisability_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDisability`
    DROP CONSTRAINT `UserDisability_disabilityId_fkey`;
ALTER TABLE `UserDisability`
    ADD CONSTRAINT `UserDisability_disabilityId_fkey` FOREIGN KEY (`disabilityId`) REFERENCES `Disability` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    DROP CONSTRAINT `Comment_authorId_fkey`;
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    DROP CONSTRAINT `Comment_cityId_fkey`;
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentDisablilty`
    DROP CONSTRAINT `CommentDisablilty_commentId_fkey`;
ALTER TABLE `CommentDisablilty`
    ADD CONSTRAINT `CommentDisablilty_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentDisablilty`
    DROP CONSTRAINT `CommentDisablilty_disabilityId_fkey`;
ALTER TABLE `CommentDisablilty`
    ADD CONSTRAINT `CommentDisablilty_disabilityId_fkey` FOREIGN KEY (`disabilityId`) REFERENCES `Disability` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ranking`
    DROP CONSTRAINT `Ranking_cityId_fkey`;
ALTER TABLE `Ranking`
    ADD CONSTRAINT `Ranking_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ranking`
    DROP CONSTRAINT `Ranking_disabilityId_fkey`;
ALTER TABLE `Ranking`
    ADD CONSTRAINT `Ranking_disabilityId_fkey` FOREIGN KEY (`disabilityId`) REFERENCES `Disability` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
