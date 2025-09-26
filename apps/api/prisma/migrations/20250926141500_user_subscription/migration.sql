ALTER TABLE "public"."User"
  ADD COLUMN "subscriptionPriceId" TEXT,
  ADD COLUMN "subscriptionStatus" TEXT,
  ADD COLUMN "subscriptionCurrentPeriodEnd" TIMESTAMP(3);
