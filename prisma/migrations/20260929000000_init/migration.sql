-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "referral_name" TEXT NOT NULL,
    "graduation_date" DATE NOT NULL,
    "referral_email" TEXT NOT NULL,
    "opening" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "resume_filename" TEXT NOT NULL,
    "resume_mime_type" TEXT NOT NULL,
    "resume_base64" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referrals_clerk_user_id_idx" ON "referrals"("clerk_user_id");

-- The API writes through Prisma after Clerk verifies the caller. Supabase's
-- browser-facing anon and authenticated roles get no direct access to resumes.
ALTER TABLE "public"."referrals" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."referrals" FROM "anon", "authenticated";
