import { Link } from "react-router-dom";
import { Button } from "../../../components/Button";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getPlanById } from "../../../app/subscriptions";
import s from "./DashboardPage.module.css";

export function DashboardPage() {
  const { user, refreshSubscription } = useAuth();
  const plan = getPlanById(user?.subscriptionPriceId ?? null);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}</h1>
          <p className={s.subtitle}>Here’s the status of your TripPlannerHQ workspace.</p>
        </div>
        <div className={s.actions}>
          <Button variant="secondary" size="sm" onClick={refreshSubscription}>
            Refresh subscription
          </Button>
          <Button variant="primary" size="sm" to="/app/billing">
            Manage billing
          </Button>
        </div>
      </header>

      <section className={s.cards}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Subscription</h2>
          {plan ? (
            <>
              <div className={s.planName}>{plan.name}</div>
              <div className={s.planPrice}>{plan.priceLabel}</div>
              <p className={s.planDescription}>{plan.description}</p>
              <p className={s.planStatus}>
                Status: <span>{user?.subscriptionStatus ?? "active"}</span>
              </p>
              <Button variant="ghost" size="sm" to="/app/billing">
                View plan details
              </Button>
            </>
          ) : (
            <>
              <p className={s.empty}>You haven’t selected a plan yet. Activate your trial to unlock TripPlannerHQ.</p>
              <Button variant="primary" size="sm" to="/signup">
                Start your trial
              </Button>
            </>
          )}
        </article>

        <article className={s.card}>
          <h2 className={s.cardTitle}>Get started</h2>
          <ul className={s.list}>
            <li>Create your first trip itinerary and invite your travel companions.</li>
            <li>Build a packing list and share it so everyone stays on track.</li>
            <li>Track expenses by currency and sync them to your budget.</li>
          </ul>
          <Link to="/app/billing" className={s.link}>Upgrade or manage your plan →</Link>
        </article>
      </section>
    </div>
  );
}
