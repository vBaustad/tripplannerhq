-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "homeCurrency" TEXT NOT NULL DEFAULT 'USD',
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trip" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budgetAmount" DECIMAL(65,30),
    "budgetCurrency" TEXT,
    "notes" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Segment" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "countryCode" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "segmentId" UUID,
    "occurredDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "merchant" TEXT,
    "notes" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "fxRateToHome" DECIMAL(65,30),
    "homeAmount" DECIMAL(65,30),
    "receiptUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Accommodation" (
    "id" UUID NOT NULL,
    "segmentId" UUID NOT NULL,
    "placeName" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "nightlyCost" DECIMAL(65,30),
    "currency" TEXT,
    "fxRateToHome" DECIMAL(65,30),
    "totalHome" DECIMAL(65,30),
    "checkinDate" TIMESTAMP(3),
    "checkoutDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreTripPurchase" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "purchasedDate" TIMESTAMP(3),
    "category" TEXT,
    "itemName" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "fxRateToHome" DECIMAL(65,30),
    "homeAmount" DECIMAL(65,30),
    "notes" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreTripPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackingItem" (
    "id" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdUtc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedUtc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurrencyRate" (
    "id" UUID NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "quoteCurrency" TEXT NOT NULL,
    "rateDate" TIMESTAMP(3) NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "CurrencyRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Trip_userId_idx" ON "public"."Trip"("userId");

-- CreateIndex
CREATE INDEX "Segment_tripId_idx" ON "public"."Segment"("tripId");

-- CreateIndex
CREATE INDEX "Expense_tripId_occurredDate_idx" ON "public"."Expense"("tripId", "occurredDate");

-- CreateIndex
CREATE INDEX "Expense_segmentId_occurredDate_idx" ON "public"."Expense"("segmentId", "occurredDate");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "public"."Expense"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Accommodation_segmentId_key" ON "public"."Accommodation"("segmentId");

-- CreateIndex
CREATE INDEX "PreTripPurchase_tripId_idx" ON "public"."PreTripPurchase"("tripId");

-- CreateIndex
CREATE INDEX "PackingItem_tripId_idx" ON "public"."PackingItem"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyRate_baseCurrency_quoteCurrency_rateDate_key" ON "public"."CurrencyRate"("baseCurrency", "quoteCurrency", "rateDate");

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "public"."Segment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Accommodation" ADD CONSTRAINT "Accommodation_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "public"."Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PreTripPurchase" ADD CONSTRAINT "PreTripPurchase_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackingItem" ADD CONSTRAINT "PackingItem_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
