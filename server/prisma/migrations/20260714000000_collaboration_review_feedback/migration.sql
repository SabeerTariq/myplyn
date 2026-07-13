-- CreateTable
CREATE TABLE `collaboration_review_feedback` (
    `id` VARCHAR(191) NOT NULL,
    `collaboration_id` VARCHAR(191) NOT NULL,
    `notes` TEXT NOT NULL,
    `file_path` VARCHAR(191) NULL,
    `file_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `collaboration_review_feedback` ADD CONSTRAINT `collaboration_review_feedback_collaboration_id_fkey` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
