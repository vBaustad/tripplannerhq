import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../../components/Button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getPlanById, subscriptionPlans } from "../../../app/subscriptions";
import s from "./BillingPage.module.css";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const FALLBACK_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID ?? "";

export function BillingPage() {
  const { user, logout, updateCustomerId, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing">("idle");

  if (!user) {
    return (
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.singleCard}>
            <h2 className={s.sectionTitle}>You need an account to continue</h2>
            <p className={s.note}>Log in again to manage your subscription.</p>
            <Button variant="primary" to="/login">Go to login</Button>
          </div>
        </div>
      </div>
    );
  }

  const plan = getPlanById(user.subscriptionPriceId ?? null);
  const plans = subscriptionPlans;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => plan?.id ?? plans[0]?.id ?? FALLBACK_PRICE_ID);

  useEffect(() => {
    if (plan?.id) {
      setSelectedPlanId(plan.id);
    }
  }, [plan?.id]);

  const selectedPlan = useMemo(
    () => plans.find((item) => item.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );

  const renewalDate = useMemo(() => {
    if (!user.subscriptionCurrentPeriodEnd) return null;
    const date = new Date(user.subscriptionCurrentPeriodEnd);
    return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
  }, [user.subscriptionCurrentPeriodEnd]);

  const successStatus = useMemo(() => {
    const statusParam = params.get("status");
    if (!statusParam) return null;
    if (statusParam === "success") return "Your subscription was updated. You can manage it below.";
    if (statusParam === "cancel") return "Checkout canceled. Try again when you are ready.";
    return null;
  }, [params]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCheckout = async () => {
    const checkoutPriceId = selectedPlan?.id ?? FALLBACK_PRICE_ID;
    if (!checkoutPriceId) {
      setError("Missing Stripe price ID. Configure your plan identifiers to continue.");
      return;
    }

    setError(null);
    setStatus("processing");

    try {
      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: checkoutPriceId,
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
        await updateCustomerId(data.customerId);
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
          <div>
            <h1 className={s.title}>Manage your TripPlannerHQ subscription</h1>
            <p className={s.subtitle}>
              Choose your plan and complete secure checkout with Stripe. Already subscribed? Manage billing directly in the portal.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={refreshSubscription}>
            Refresh status
          </Button>
        </header>

        <div className={s.layout}>
          <section className={s.planColumn}>
            <div className={s.planIntro}>
              <h2 className={s.sectionTitle}>Plans</h2>
              <p className={s.planHint}>Select a tier to preview pricing and benefits. You can switch later.</p>
            </div>

            <div className={s.planList}>
              {plans.length === 0 ? (
                <div className={s.placeholder}>No Stripe price IDs configured. Add plan IDs to your environment variables.</div>
              ) : (
                plans.map((planOption) => {
                  const isSelected = planOption.id === selectedPlanId;
                  const isCurrent = plan?.id === planOption.id;
                  return (
                    <button
                      key={planOption.id}
                      type="button"
                      className={`${s.planCard} ${isSelected ? s.planCardActive : ""}`}
                      onClick={() => setSelectedPlanId(planOption.id)}
                      aria-pressed={isSelected}
                    >
                      <div className={s.planCardHeader}>
                        <h3 className={s.planName}>{planOption.name}</h3>
                        {isCurrent ? <span className={s.badge}>Current</span> : null}
                      </div>
                      <div className={s.planPrice}>{planOption.priceLabel}</div>
                      <p className={s.planDescription}>{planOption.description}</p>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className={s.paymentColumn}>
            <div className={s.meta}>
              <span><strong>Name:</strong> {user.name}</span>
              <span><strong>Email:</strong> {user.email}</span>
              <span><strong>Stripe customer:</strong> {user.stripeCustomerId ?? "Not yet created"}</span>
            </div>

            <div className={s.subscriptionSummary}>
              <div>
                <span className={s.summaryLabel}>Selected tier</span>
                <div className={s.summaryValue}>{selectedPlan?.name ?? "Select a plan"}</div>
                {selectedPlan ? <p className={s.summaryMeta}>{selectedPlan.priceLabel}</p> : null}
              </div>
              <div>
                <span className={s.summaryLabel}>Current status</span>
                <div className={s.summaryValue}>{user.subscriptionStatus ?? (plan ? "active" : "inactive")}</div>
              </div>
              <div>
                <span className={s.summaryLabel}>Renews</span>
                <div className={s.summaryValue}>{renewalDate ?? "After trial"}</div>
              </div>
            </div>

            {successStatus ? <div className={s.success}>{successStatus}</div> : null}
            {error ? <div className={s.alert}>{error}</div> : null}

            <div className={s.actions}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                disabled={status === "processing" || !selectedPlanId}
              >
                {status === "processing" ? "Starting checkout..." : "Continue to Stripe"}
              </Button>
              <Button variant="secondary" size="lg" onClick={handlePortal} disabled={status === "processing"}>
                Manage in Stripe portal
              </Button>
              <Button variant="ghost" size="lg" onClick={handleLogout}>
                Log out
              </Button>
            </div>

            <ul className={s.statusList}>
              <li>Stripe securely handles all payment information.</li>
              <li>You can switch plans or cancel anytime from the customer portal.</li>
            </ul>

            <p className={s.note}>
              Need to update pricing IDs? Adjust <code>PRICE_EXPLORER_ID</code>, <code>PRICE_ADVENTURER_ID</code>, and <code>PRICE_GLOBETROTTER_ID</code> (plus their Vite counterparts).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
