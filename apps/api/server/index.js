import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 4242;
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
const allowedOrigins = (process.env.CORS_ORIGINS ?? clientUrl)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId = process.env.STRIPE_PRICE_ID ?? null;
let stripe = null;

if (!stripeSecretKey) {
  console.warn("[stripe] STRIPE_SECRET_KEY is not set. Stripe endpoints will return 500 until configured.");
} else {
  stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
}

function requireStripe(res) {
  if (!stripe) {
    res.status(500).json({ error: "Stripe is not configured" });
    return false;
  }
  return true;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/create-customer", async (req, res) => {
  if (!requireStripe(res)) return;

  const { email, name } = req.body ?? {};
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({ email, name });

    res.json({ customerId: customer.id });
  } catch (error) {
    console.error("[stripe] create-customer failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create customer" });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  if (!requireStripe(res)) return;

  const { priceId, customerId, customerEmail } = req.body ?? {};
  const resolvedPrice = priceId ?? stripePriceId;

  if (!resolvedPrice) {
    res.status(400).json({ error: "Missing Stripe price ID" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      allow_promotion_codes: true,
      line_items: [{ price: resolvedPrice, quantity: 1 }],
      success_url: `${clientUrl}/app/billing?status=success`,
      cancel_url: `${clientUrl}/app/billing?status=cancel`,
      customer: customerId || undefined,
      customer_email: customerId ? undefined : customerEmail,
    });

    if (!customerId && session.customer && typeof session.customer === "string") {
      res.json({ url: session.url, customerId: session.customer });
      return;
    }

    res.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] create-checkout-session failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create checkout session" });
  }
});

app.post("/api/create-customer-portal-session", async (req, res) => {
  if (!requireStripe(res)) return;

  const { customerId } = req.body ?? {};
  if (!customerId) {
    res.status(400).json({ error: "Customer ID is required" });
    return;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${clientUrl}/app/billing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("[stripe] create-customer-portal-session failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create billing portal session" });
  }
});

app.listen(port, () => {
  console.log(`Stripe helper server listening on http://localhost:${port}`);
});
