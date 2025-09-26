import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import bcrypt from "bcryptjs";

import prisma from "./prisma.js";

dotenv.config();

const app = express();
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
const allowedOrigins = (process.env.CORS_ORIGINS ?? clientUrl)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? null;
const stripePriceId = process.env.STRIPE_PRICE_ID ?? null;
const configuredPlanPriceIds = [
  process.env.PRICE_EXPLORER_ID,
  process.env.PRICE_ADVENTURER_ID,
  process.env.PRICE_GLOBETROTTER_ID,
]
  .map((value) => (typeof value === "string" ? value.trim() : ""))
  .filter((value) => value.length > 0);
const validPlanPriceIds =
  configuredPlanPriceIds.length > 0 ? new Set(configuredPlanPriceIds) : null;
let stripe = null;

if (!stripeSecretKey) {
  console.warn("[stripe] STRIPE_SECRET_KEY is not set. Stripe endpoints will return 500 until configured.");
} else {
  stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
}

if (!stripePublishableKey) {
  console.warn("[stripe] STRIPE_PUBLISHABLE_KEY is not set. Client requests will rely on Vite fallback env vars.");
}

const PASSWORD_SALT_ROUNDS = 10;

function requireStripe(res) {
  if (!stripe) {
    res.status(500).json({ error: "Stripe is not configured" });
    return false;
  }
  return true;
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function sanitizeUser(user) {
  if (!user) return null;
  const displayName =
    typeof user.displayName === "string" && user.displayName.trim().length > 0
      ? user.displayName
      : user.email;
  return {
    id: user.id,
    name: displayName,
    email: user.email,
    stripeCustomerId: user.stripeCustomerId ?? null,
    subscriptionPriceId: user.subscriptionPriceId ?? null,
    subscriptionStatus: user.subscriptionStatus ?? null,
    subscriptionCurrentPeriodEnd:
      user.subscriptionCurrentPeriodEnd instanceof Date
        ? user.subscriptionCurrentPeriodEnd.toISOString()
        : user.subscriptionCurrentPeriodEnd ?? null,
    homeCurrency: user.homeCurrency,
    createdUtc: user.createdUtc instanceof Date ? user.createdUtc.toISOString() : user.createdUtc,
    updatedUtc: user.updatedUtc instanceof Date ? user.updatedUtc.toISOString() : user.updatedUtc,
  };
}

async function ensureStripeCustomer({ name, email }) {
  if (!stripe) return null;
  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      return existing.data[0].id;
    }
    const created = await stripe.customers.create({ email, name });
    return created.id;
  } catch (error) {
    console.error("[stripe] ensure customer failed", error);
    throw new Error("Unable to create Stripe customer");
  }
}

function isSupportedPlanPriceId(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (!validPlanPriceIds) return true;
  return validPlanPriceIds.has(trimmed);
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const SIGNUP_SESSION_TTL_MINUTES = Number.parseInt(process.env.SIGNUP_SESSION_TTL_MINUTES ?? "2880", 10);

function computeExpiryUtc(minutesFromNow) {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
}

app.post("/api/auth/signup", async (req, res) => {
  if (!requireStripe(res)) return;

  const { name, email, password, planPriceId } = req.body ?? {};

  if (!name || typeof name !== "string" || !email || typeof email !== "string" || !password || typeof password !== "string") {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }
  const trimmedName = name.trim();

  if (!trimmedName) {
    res.status(400).json({ error: "Name is required." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters long." });
    return;
  }

  const normalizedPlanPriceId = typeof planPriceId === "string" ? planPriceId.trim() : "";
  if (!isSupportedPlanPriceId(normalizedPlanPriceId)) {
    res.status(400).json({ error: "Select a supported subscription plan." });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(409).json({ error: "An account already exists for that email." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
    let stripeCustomerId = null;

    try {
      stripeCustomerId = await ensureStripeCustomer({ name: trimmedName, email: normalizedEmail });
    } catch (error) {
      res.status(502).json({ error: error instanceof Error ? error.message : "Unable to create Stripe customer." });
      return;
    }

    if (!stripeCustomerId) {
      res.status(502).json({ error: "Unable to create Stripe customer." });
      return;
    }

    const expiresUtc = computeExpiryUtc(SIGNUP_SESSION_TTL_MINUTES > 0 ? SIGNUP_SESSION_TTL_MINUTES : 2880);

    const signupSession = await prisma.signupSession.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        displayName: trimmedName,
        passwordHash,
        stripeCustomerId,
        expiresUtc,
        planPriceId: normalizedPlanPriceId,
      },
      update: {
        displayName: trimmedName,
        passwordHash,
        stripeCustomerId,
        expiresUtc,
        planPriceId: normalizedPlanPriceId,
        setupIntentId: null,
      },
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    let clientSecret = setupIntent.client_secret ?? null;
    if (!clientSecret) {
      const refreshedIntent = await stripe.setupIntents.retrieve(setupIntent.id);
      clientSecret = refreshedIntent.client_secret ?? null;
    }

    if (!clientSecret) {
      res.status(502).json({ error: "Stripe did not return a client secret." });
      return;
    }

    const sessionCustomerId = typeof setupIntent.customer === "string" ? setupIntent.customer : stripeCustomerId;

    const finalSession = await prisma.signupSession.update({
      where: { id: signupSession.id },
      data: {
        stripeCustomerId: sessionCustomerId,
        setupIntentId: setupIntent.id,
      },
    });

    res.status(201).json({
      signupId: finalSession.id,
      clientSecret,
      publishableKey: stripePublishableKey,
      planPriceId: normalizedPlanPriceId,
    });
  } catch (error) {
    console.error("[auth] signup failed", error);
    res.status(500).json({ error: "Failed to start signup." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(401).json({ error: "No account found for that email." });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: "Incorrect password." });
      return;
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("[auth] login failed", error);
    res.status(500).json({ error: "Failed to sign in." });
  }
});

app.post("/api/auth/activate", async (req, res) => {
  if (!requireStripe(res)) return;

  const { signupId, setupIntentId } = req.body ?? {};

  if (typeof signupId !== "string" || signupId.trim().length === 0 || typeof setupIntentId !== "string" || setupIntentId.trim().length === 0) {
    res.status(400).json({ error: "signupId and setupIntentId are required." });
    return;
  }

  const trimmedSignupId = signupId.trim();
  const trimmedSetupIntentId = setupIntentId.trim();

  try {
    const signupSession = await prisma.signupSession.findUnique({ where: { id: trimmedSignupId } });
    if (!signupSession) {
      res.status(404).json({ error: "Signup session not found." });
      return;
    }

    if (signupSession.expiresUtc <= new Date()) {
      await prisma.signupSession.delete({ where: { id: trimmedSignupId } }).catch(() => {});
      res.status(410).json({ error: "Signup session expired. Please start over." });
      return;
    }

    if (!signupSession.setupIntentId || signupSession.setupIntentId !== trimmedSetupIntentId) {
      res.status(400).json({ error: "Setup intent does not match signup." });
      return;
    }

    if (!isSupportedPlanPriceId(signupSession.planPriceId)) {
      res.status(500).json({ error: "Signup session is missing a valid plan." });
      return;
    }

    const setupIntent = await stripe.setupIntents.retrieve(trimmedSetupIntentId, {
      expand: ["payment_method"],
    });

    if (!setupIntent || setupIntent.status !== "succeeded") {
      res.status(409).json({ error: "Payment method has not been confirmed yet." });
      return;
    }

    const paymentMethodId = typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : setupIntent.payment_method?.id;

    if (!paymentMethodId) {
      res.status(500).json({ error: "Stripe setup intent is missing a payment method." });
      return;
    }

    const stripeCustomerId = typeof setupIntent.customer === "string"
      ? setupIntent.customer
      : signupSession.stripeCustomerId;

    if (!stripeCustomerId) {
      res.status(500).json({ error: "Stripe customer was not resolved." });
      return;
    }

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: signupSession.planPriceId }],
      trial_period_days: 14,
      default_payment_method: paymentMethodId,
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      metadata: {
        signupId: signupSession.id,
        email: signupSession.email,
      },
    });

    const subscriptionPriceId =
      subscription.items?.data?.[0]?.price?.id ?? signupSession.planPriceId;
    const subscriptionStatus = subscription.status ?? null;
    const subscriptionCurrentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;

    const existingUser = await prisma.user.findUnique({ where: { email: signupSession.email } });
    if (existingUser) {
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          stripeCustomerId,
          subscriptionPriceId,
          subscriptionStatus,
          subscriptionCurrentPeriodEnd,
        },
      });
      await prisma.signupSession.delete({ where: { id: signupSession.id } }).catch(() => {});
      res.json({ user: sanitizeUser(updatedUser) });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email: signupSession.email,
        displayName: signupSession.displayName || null,
        passwordHash: signupSession.passwordHash,
        stripeCustomerId,
        subscriptionPriceId,
        subscriptionStatus,
        subscriptionCurrentPeriodEnd,
      },
    });

    await prisma.signupSession.delete({ where: { id: signupSession.id } }).catch(() => {});

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("[auth] activate failed", error);
    res.status(500).json({ error: "Failed to finalize signup." });
  }
});

app.patch("/api/users/:id/stripe-customer", async (req, res) => {
  const { id } = req.params;
  const { stripeCustomerId } = req.body ?? {};

  if (!id) {
    res.status(400).json({ error: "User ID is required." });
    return;
  }

  if (stripeCustomerId !== null && typeof stripeCustomerId !== "string") {
    res.status(400).json({ error: "stripeCustomerId must be a string or null." });
    return;
  }

  try {
    const normalizedStripeId =
      typeof stripeCustomerId === "string" && stripeCustomerId.trim().length > 0
        ? stripeCustomerId.trim()
        : null;
    const user = await prisma.user.update({
      where: { id },
      data: { stripeCustomerId: normalizedStripeId },
    });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("[users] update stripe customer failed", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      res.status(404).json({ error: "User not found." });
      return;
    }
    res.status(500).json({ error: "Failed to update Stripe customer ID." });
  }
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

app.get("/api/users/:id/subscription", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (!stripe || !user.stripeCustomerId) {
      res.json({ user: sanitizeUser(user), subscription: null });
      return;
    }

    const subscriptions = await stripe.subscriptions.list({ customer: user.stripeCustomerId, status: "all", limit: 5 });
    const subscription = subscriptions.data.sort((a, b) => (b.created ?? 0) - (a.created ?? 0))[0] ?? null;

    let updatedUser = user;

    if (subscription) {
      const priceId = subscription.items?.data?.[0]?.price?.id ?? null;
      const status = subscription.status ?? null;
      const periodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null;

      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPriceId: priceId,
          subscriptionStatus: status,
          subscriptionCurrentPeriodEnd: periodEnd,
        },
      });

      res.json({
        user: sanitizeUser(updatedUser),
        subscription: {
          id: subscription.id,
          status,
          priceId,
          currentPeriodEnd: periodEnd ? periodEnd.toISOString() : null,
        },
      });
      return;
    }

    if (user.subscriptionPriceId || user.subscriptionStatus || user.subscriptionCurrentPeriodEnd) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPriceId: null,
          subscriptionStatus: null,
          subscriptionCurrentPeriodEnd: null,
        },
      });
    }

    res.json({ user: sanitizeUser(updatedUser), subscription: null });
  } catch (error) {
    console.error("[users] subscription lookup failed", error);
    res.status(500).json({ error: "Failed to look up subscription." });
  }
});

app.patch("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { displayName, homeCurrency } = req.body ?? {};

  const data = {};

  if (typeof displayName === "string") {
    const trimmed = displayName.trim();
    data.displayName = trimmed.length > 0 ? trimmed : null;
  }

  if (typeof homeCurrency === "string") {
    const normalized = homeCurrency.trim().toUpperCase();
    if (normalized.length !== 3) {
      res.status(400).json({ error: "homeCurrency must be a 3-letter ISO code." });
      return;
    }
    data.homeCurrency = normalized;
  }

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "No changes supplied." });
    return;
  }

  try {
    const user = await prisma.user.update({ where: { id }, data });
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("[users] update profile failed", error);
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      res.status(404).json({ error: "User not found." });
      return;
    }
    res.status(500).json({ error: "Failed to update profile." });
  }
});

export default app;
