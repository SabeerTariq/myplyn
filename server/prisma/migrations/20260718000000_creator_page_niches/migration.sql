-- CreateTable
CREATE TABLE `creator_page_niches` (
    `page_id` VARCHAR(191) NOT NULL,
    `niche_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`page_id`, `niche_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrate existing single niche selections
INSERT INTO `creator_page_niches` (`page_id`, `niche_id`)
SELECT `id`, `niche_id` FROM `creator_pages` WHERE `niche_id` IS NOT NULL;

-- AddForeignKey
ALTER TABLE `creator_page_niches` ADD CONSTRAINT `creator_page_niches_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `creator_pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `creator_page_niches` ADD CONSTRAINT `creator_page_niches_niche_id_fkey` FOREIGN KEY (`niche_id`) REFERENCES `niches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
