-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('NOTIFICATION', 'ANNOUNCEMENT');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "category" "NotificationCategory" NOT NULL DEFAULT 'NOTIFICATION';
