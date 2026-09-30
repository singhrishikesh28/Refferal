-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('pending', 'success', 'failure');

-- Keep the existing referral while making email comparisons consistent.
UPDATE "public"."referrals" SET "referral_email" = lower(btrim("referral_email"));

-- DropIndex
DROP INDEX "referrals_clerk_user_id_idx";

-- AlterTable
ALTER TABLE "referrals" DROP CONSTRAINT "referrals_pkey",
DROP COLUMN "clerk_user_id",
DROP COLUMN "id",
ADD COLUMN     "status" "ReferralStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "status_message" TEXT,
ADD CONSTRAINT "referrals_pkey" PRIMARY KEY ("referral_email");
