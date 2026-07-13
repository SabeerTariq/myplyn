-- CreateTable
CREATE TABLE "collaboration_review_feedback" (
    "id" TEXT NOT NULL,
    "collaboration_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "file_path" TEXT,
    "file_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collaboration_review_feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collaboration_review_feedback" ADD CONSTRAINT "collaboration_review_feedback_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "collaborations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
