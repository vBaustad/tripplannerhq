import s from "../AppSection.module.css";

export function PackingPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Packing Lists</h1>
        <p className={s.subtitle}>Track items for each traveler, sync across devices, and get guidance from TripPlanner AI.</p>
      </header>

      <section className={s.cards}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Checklist experience</h2>
          <p className={s.text}>Design an interactive matrix with categories, quantities, and packed status.</p>
          <p className={s.text}>(Pro) Provide an “Generate suggestions” call-to-action powered by AI.</p>
        </article>
      </section>
    </div>
  );
}
