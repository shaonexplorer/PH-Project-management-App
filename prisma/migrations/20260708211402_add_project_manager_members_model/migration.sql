-- CreateTable
CREATE TABLE "project_manager_members" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "project_manager_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_manager_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_manager_members_member_id_key" ON "project_manager_members"("member_id");

-- AddForeignKey
ALTER TABLE "project_manager_members" ADD CONSTRAINT "project_manager_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_manager_members" ADD CONSTRAINT "project_manager_members_project_manager_id_fkey" FOREIGN KEY ("project_manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
