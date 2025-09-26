-- Clean up existing signup sessions to simplify migration
DELETE FROM "public"."SignupSession";

-- Remove old checkout session tracking and add plan/intent metadata
DROP INDEX IF EXISTS "SignupSession_checkoutSessionId_key";

ALTER TABLE "public"."SignupSession"
  DROP COLUMN IF EXISTS "checkoutSessionId",
  ADD COLUMN    "planPriceId" TEXT NOT NULL,
  ADD COLUMN    "setupIntentId" TEXT;
