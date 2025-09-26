import s from "../AppSection.module.css";

export function TripCreatePage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Plan a New Trip</h1>
        <p className={s.subtitle}>Capture the basics—destinations, dates, and travelers—to kick off a fresh itinerary.</p>
      </header>

      <section className={s.cards}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Trip wizard</h2>
          <p className={s.text}>Add a multi-step flow for trip metadata, budget targets, and invited collaborators.</p>
          <p className={s.text}>Once saved, redirect into the Trip Detail tabs to continue planning.</p>
        </article>
      </section>
    </div>
  );
}
