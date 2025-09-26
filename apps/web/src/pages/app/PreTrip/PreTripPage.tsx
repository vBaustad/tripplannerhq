import s from "../AppSection.module.css";

export function PreTripPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Pre-Trip Planner</h1>
        <p className={s.subtitle}>Track purchases, bookings, and to-dos before departure.</p>
      </header>

      <section className={`${s.cards} ${s.twoColumn}`}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Pre-trip purchases</h2>
          <p className={s.text}>List travel insurance, gear, and other costs that hit prior to day one.</p>
          <p className={s.text}>Connect entries to the budget so they roll into overall spend.</p>
        </article>

        <article className={s.card}>
          <h2 className={s.cardTitle}>Accommodation board</h2>
          <p className={s.text}>Manage booking confirmations, nightly rates, and payment schedules.</p>
          <p className={s.text}>Include reminders for check-in times and cancellation windows.</p>
        </article>
      </section>
    </div>
  );
}
