import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/Button";
import { useAuth } from "../../../app/providers/AuthProvider";
import s from "./BillingPage.module.css";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID ?? "";

export function BillingPage() {
  const { user, logout, updateCustomerId } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing">("idle");

  const successStatus = useMemo(() => {
    const statusParam = params.get("status");
    if (!statusParam) return null;
    if (statusParam === "success") return "Your subscription was updated. You can manage it below.";
    if (statusParam === "cancel") return "Checkout canceled. Try again when you are ready.";
    return null;
  }, [params]);

  if (!user) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.card}>
            <h2 className={s.sectionTitle}>You need an account to continue</h2>
            <p className={s.note}>Log in again to manage your subscription.</p>
            <Button variant="primary" to="/login">Go to login</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCheckout = async () => {
    if (!PRICE_ID) {
      setError("Missing Stripe price ID. Set VITE_STRIPE_PRICE_ID in your environment.");
      return;
    }

    setError(null);
    setStatus("processing");

    try {
      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: PRICE_ID,
          customerId: user.stripeCustomerId,
          customerEmail: user.email,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "Unable to start checkout. Check your server logs.");
      }

      const data = (await response.json()) as { url?: string; customerId?: string };
      if (data.customerId && data.customerId !== user.stripeCustomerId) {
        updateCustomerId(data.customerId);
      }
      if (!data.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("idle");
    }
  };

  const handlePortal = async () => {
    if (!user.stripeCustomerId) {
      setError("We could not find a Stripe customer for this account. Complete checkout first.");
      return;
    }

    setError(null);
    setStatus("processing");

    try {
      const response = await fetch(`${API_BASE}/api/create-customer-portal-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: user.stripeCustomerId }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "Unable to open the billing portal.");
      }

      const data = (await response.json()) as { url?: string };
      if (!data.url) {
        throw new Error("Stripe did not return a billing portal URL.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open portal. Try again later.");
      setStatus("idle");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.container}>
        <header className={s.header}>
          <h1 className={s.title}>Manage your TripPlannerHQ subscription</h1>
          <p className={s.subtitle}>
            Launch Stripe's secure checkout to start a subscription or open the customer portal to update payment details and plans.
          </p>
        </header>

        <section className={s.card}>
          <div className={s.meta}>
            <span><strong>Name:</strong> {user.name}</span>
            <span><strong>Email:</strong> {user.email}</span>
            <span><strong>Stripe customer:</strong> {user.stripeCustomerId ?? "Not yet created"}</span>
          </div>

          {successStatus ? <div className={s.success}>{successStatus}</div> : null}
          {error ? <div className={s.alert}>{error}</div> : null}

          <div className={s.actions}>
            <Button variant="primary" size="lg" onClick={handleCheckout} disabled={status === "processing"}>
              {status === "processing" ? "Working..." : "Start subscription"}
            </Button>
            <Button variant="secondary" size="lg" onClick={handlePortal} disabled={status === "processing"}>
              Manage billing in Stripe
            </Button>
            <Button variant="ghost" size="lg" onClick={handleLogout}>
              Log out
            </Button>
          </div>

          <ul className={s.statusList}>
            <li>Checkout uses Stripe's prebuilt subscription page with your configured price ID.</li>
            <li>Billing portal lets you change plans, payment methods, or cancel anytime.</li>
            <li>Need to update pricing? Adjust <code>STRIPE_PRICE_ID</code> and <code>VITE_STRIPE_PRICE_ID</code>.</li>
          </ul>

          <p className={s.note}>
            Make sure your development server is running with access to <code>STRIPE_SECRET_KEY</code> and the same origin allowed in <code>CORS_ORIGINS</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
