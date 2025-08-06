-- CreateTable
CREATE TABLE "public"."ForumPost" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ForumPost" ADD CONSTRAINT "ForumPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ForumPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
