import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";

import { Button } from "../../components/Button";
import { useAuth } from "../../app/providers/AuthProvider";
import s from "./AuthPage.module.css";

type PlanOption = {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  popular?: boolean;
};

const fallbackPublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";

const planOptions: PlanOption[] = [
  {
    id: import.meta.env.VITE_STRIPE_PLAN_EXPLORER_ID ?? "",
    name: "Explorer",
    priceLabel: "$9.99 / month",
    description: "Perfect for solo travelers and weekend getaways.",
  },
  {
    id: import.meta.env.VITE_STRIPE_PLAN_ADVENTURER_ID ?? "",
    name: "Adventurer",
    priceLabel: "$19.99 / month",
    description: "Ideal for families or frequent explorers.",
    popular: true,
  },
  {
    id: import.meta.env.VITE_STRIPE_PLAN_GLOBETROTTER_ID ?? "",
    name: "Globetrotter",
    priceLabel: "$39.99 / month",
    description: "Built for travel planners and group leaders.",
  },
].filter((plan) => typeof plan.id === "string" && plan.id.length > 0);

const elementsAppearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
};

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const defaultPlan = useMemo(() => planOptions.find((plan) => plan.popular) ?? planOptions[0] ?? null, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlan?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);

  const [signupContext, setSignupContext] = useState<{
    signupId: string;
    clientSecret: string;
    publishableKey: string;
  } | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [phase, setPhase] = useState<"details" | "payment">("details");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [phase]);

  const selectedPlan = useMemo(
    () => planOptions.find((plan) => plan.id === selectedPlanId) ?? defaultPlan ?? null,
    [selectedPlanId, defaultPlan]
  );

  useEffect(() => {
    if (planOptions.length === 0) return;
    if (!planOptions.some((plan) => plan.id === selectedPlanId)) {
      setSelectedPlanId(planOptions[0].id);
    }
  }, [selectedPlanId, planOptions]);

  const handleSubmitDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in your name, email, and password.");
      return;
    }

    if (!selectedPlan) {
      setError("Select a subscription plan to continue.");
      return;
    }

    setIsSubmittingDetails(true);

    try {
      const result = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        planPriceId: selectedPlan.id,
      });

      const publishableKey = result.publishableKey && result.publishableKey.length > 0
        ? result.publishableKey
        : fallbackPublishableKey;

      if (!publishableKey) {
        throw new Error("Stripe publishable key is not configured.");
      }

      const promise = loadStripe(publishableKey);
      setStripePromise(promise);
      setSignupContext({ signupId: result.signupId, clientSecret: result.clientSecret, publishableKey });
      setError(null);
      setPhase("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handleEditDetails = () => {
    setPhase("details");
    setSignupContext(null);
    setStripePromise(null);
    setError(null);
    setIsSubmittingDetails(false);
  };

  const handlePaymentSuccess = () => {
    navigate("/app/billing", { replace: true });
  };

  const isPaymentPhase = phase === "payment" && signupContext && stripePromise;

  return (
    <div className={s.page}>
      {isPaymentPhase ? (
        <div className={s.checkoutOuter}>
          <Elements
            stripe={stripePromise!}
            options={{ clientSecret: signupContext!.clientSecret, appearance: elementsAppearance }}
          >
            <SignupPaymentStep
              signupId={signupContext!.signupId}
              plan={selectedPlan}
              onEditDetails={handleEditDetails}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      ) : (
        <div className={s.center}>
          <div className={s.card}>
            <header className={s.header}>
              <h1 className={s.title}>Create your account</h1>
              <p className={s.subtitle}>Start planning smarter trips with shared budgets, reminders, and collaborative tools.</p>
            </header>

            <form className={s.form} onSubmit={handleSubmitDetails}>
              {error ? <div className={s.error}>{error}</div> : null}

              <div className={s.field}>
                <label className={s.label} htmlFor="name">Name</label>
                <input
                  id="name"
                  className={s.input}
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Taylor Traveler"
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  className={s.input}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className={s.field}>
                <label className={s.label} htmlFor="password">Password</label>
                <input
                  id="password"
                  className={s.input}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                />
                <span className={s.hint}>Use at least 8 characters. Your password is encrypted before it reaches our database.</span>
              </div>

              {planOptions.length > 0 ? (
                <div className={s.planSection}>
                  <div className={s.planSectionHeader}>
                    <span className={s.label}>Choose your plan</span>
                    <span className={s.planTrial}>14-day free trial included</span>
                  </div>
                  <div className={s.planGrid}>
                    {planOptions.map((plan) => {
                      const isActive = plan.id === selectedPlanId;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          className={`${s.planOption} ${isActive ? s.planOptionActive : ""}`}
                          onClick={() => setSelectedPlanId(plan.id)}
                        >
                          <div className={s.planOptionHeader}>
                            <span className={s.planName}>{plan.name}</span>
                            {plan.popular ? <span className={s.planBadge}>Most popular</span> : null}
                          </div>
                          <div className={s.planPrice}>{plan.priceLabel}</div>
                          <p className={s.planDescription}>{plan.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className={s.actions}>
                <Button variant="primary" size="lg" type="submit" disabled={isSubmittingDetails}>
                  {isSubmittingDetails ? "Preparing checkout..." : "Continue to secure checkout"}
                </Button>
              </div>

              <p className={s.stripeNotice}>We partner with <span>Stripe</span> to process payments. You won’t be charged until your trial ends.</p>
            </form>

            <p className={s.altAction}>
              Already have an account? <Link to="/login" className={s.link}>Log in</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type SignupPaymentStepProps = {
  signupId: string;
  plan: PlanOption | null;
  onEditDetails: () => void;
  onSuccess: () => void;
};

function SignupPaymentStep({ signupId, plan, onEditDetails, onSuccess }: SignupPaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { completeSignup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Unable to confirm your payment method.");
      setSubmitting(false);
      return;
    }

    const setupIntent = result.setupIntent;
    if (!setupIntent || setupIntent.status !== "succeeded") {
      setError("Your payment method is still being confirmed. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      await completeSignup(signupId, setupIntent.id);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate your account.");
      setSubmitting(false);
    }
  };

  return (
    <div className={s.checkoutShell}>
      <aside className={s.checkoutLeft}>
        <div className={s.checkoutBrand}>
          <div className={s.checkoutLogo}>TP</div>
          <div>
            <div className={s.checkoutBrandName}>TripPlannerHQ</div>
            <div className={s.checkoutTagline}>Plan smarter trips with confidence.</div>
          </div>
        </div>

        <div className={s.checkoutPlanCard}>
          <span className={s.label}>Your plan</span>
          {plan ? (
            <>
              <div className={s.checkoutPlanName}>
                {plan.name}
                {plan.popular ? <span className={s.planBadgeInline}>Most popular</span> : null}
              </div>
              <div className={s.checkoutPlanPrice}>{plan.priceLabel}</div>
              <p className={s.checkoutPlanDescription}>{plan.description}</p>
            </>
          ) : (
            <p className={s.checkoutPlanDescription}>Choose the plan that fits best.</p>
          )}
        </div>

        <p className={s.checkoutBlurb}>Enjoy a 14-day free trial. You can cancel anytime before it renews.</p>
        <span className={s.checkoutPowered}>Powered by Stripe</span>
      </aside>

      <form className={s.checkoutRight} onSubmit={handleSubmit}>
        <div className={s.checkoutHeader}>
          <h2 className={s.checkoutTitle}>Secure checkout</h2>
          <button type="button" className={s.planEdit} onClick={onEditDetails} disabled={submitting}>
            Edit details
          </button>
        </div>

        <div className={s.paymentElementWrapper}>
          <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        </div>

        {error ? <div className={s.error}>{error}</div> : null}

        <Button variant="primary" size="lg" type="submit" disabled={submitting || !stripe}>
          {submitting ? "Activating..." : "Start free trial"}
        </Button>

        <p className={s.checkoutFootnote}>We’ll charge {plan?.priceLabel ?? "your plan"} after the free trial ends.</p>
        <p className={s.checkoutAlt}>Already have an account? <Link to="/login" className={s.link}>Log in</Link></p>
        <p className={s.checkoutStripe}>Securely processed by <span>Stripe</span></p>
      </form>
    </div>
  );
}
