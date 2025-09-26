import s from "../AppSection.module.css";

export function SubscriptionPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Subscription</h1>
        <p className={s.subtitle}>Compare Free, Hobby, and Pro tiers, upgrade when ready, and review renewal details.</p>
      </header>

      <section className={`${s.cards} ${s.twoColumn}`}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Plan comparison</h2>
          <p className={s.text}>Show a matrix of features and limits for each subscription tier.</p>
          <p className={s.text}>Indicate which features (like AI suggestions) are Pro-only.</p>
        </article>

        <article className={s.card}>
          <h2 className={s.cardTitle}>Billing status</h2>
          <p className={s.text}>Surface the current plan, next renewal, and a link to manage payment methods.</p>
          <p className={s.text}>Reuse the Stripe customer portal for full billing changes.</p>
        </article>
      </section>
    </div>
  );
}
