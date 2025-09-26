-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "public"."User"("stripeCustomerId");
