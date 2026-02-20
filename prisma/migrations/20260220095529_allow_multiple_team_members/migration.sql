-- DropIndex
DROP INDEX "TeamMember_teamId_key";

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");
