import { type FormEvent, useState } from "react";
import { Button } from "../../../components/Button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getPlanById } from "../../../app/subscriptions";
import s from "./AccountPage.module.css";

export function AccountPage() {
  const { user, updateProfile, refreshSubscription } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [homeCurrency, setHomeCurrency] = useState(user?.homeCurrency ?? "USD");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const plan = getPlanById(user?.subscriptionPriceId ?? null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setStatus("saving");
    setMessage(null);

    try {
      await updateProfile({ name, homeCurrency });
      setStatus("success");
      setMessage("Account details updated.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update account.");
    }
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Account settings</h1>
          <p className={s.subtitle}>Update your profile, locale preferences, and subscription info.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={refreshSubscription}>
          Refresh subscription
        </Button>
      </header>

      <div className={s.layout}>
        <section className={s.card}>
          <h2 className={s.sectionTitle}>Profile</h2>
          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label} htmlFor="name">Name</label>
              <input
                id="name"
                className={s.input}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Taylor Traveler"
              />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="currency">Home currency</label>
              <input
                id="currency"
                className={s.input}
                type="text"
                maxLength={3}
                value={homeCurrency}
                onChange={(event) => setHomeCurrency(event.target.value.toUpperCase())}
              />
              <span className={s.hint}>Use a 3-letter ISO currency code like USD or EUR.</span>
            </div>

            {message ? (
              <div className={status === "error" ? s.error : s.success}>{message}</div>
            ) : null}

            <div className={s.actions}>
              <Button variant="primary" size="lg" type="submit" disabled={status === "saving"}>
                {status === "saving" ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </section>

        <section className={s.card}>
          <h2 className={s.sectionTitle}>Subscription</h2>
          {plan ? (
            <>
              <div className={s.planName}>{plan.name}</div>
              <div className={s.planPrice}>{plan.priceLabel}</div>
              <p className={s.planDescription}>{plan.description}</p>
              <p className={s.planStatus}>Status: <span>{user?.subscriptionStatus ?? "active"}</span></p>
              <Button variant="ghost" size="sm" to="/app/billing">
                Manage in billing →
              </Button>
            </>
          ) : (
            <>
              <p className={s.empty}>No active subscription detected. Start a trial to unlock TripPlannerHQ.</p>
              <Button variant="primary" size="sm" to="/signup">
                Start free trial
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
