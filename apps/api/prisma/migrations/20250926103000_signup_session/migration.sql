-- CreateTable
CREATE TABLE "public"."SignupSession" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "checkoutSessionId" TEXT,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignupSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SignupSession_email_key" ON "public"."SignupSession"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SignupSession_checkoutSessionId_key" ON "public"."SignupSession"("checkoutSessionId");
