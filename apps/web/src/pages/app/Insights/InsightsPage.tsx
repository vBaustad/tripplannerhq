import s from "../AppSection.module.css";

export function InsightsPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Insights & AI</h1>
        <p className={s.subtitle}>Surface intelligent recommendations for itineraries, budgets, and categorization.</p>
      </header>

      <section className={`${s.cards} ${s.twoColumn}`}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Itinerary intelligence</h2>
          <p className={s.text}>(Pro) Generate daily plans, activities, and dining recommendations for each trip segment.</p>
          <p className={s.text}>Provide quick actions to accept suggestions into the main itinerary.</p>
        </article>

        <article className={s.card}>
          <h2 className={s.cardTitle}>Budget insights</h2>
          <p className={s.text}>Alert travelers when they overspend, highlight category trends, and show benchmark averages.</p>
          <p className={s.text}>(Pro) Auto-categorize expenses using machine learning.</p>
        </article>
      </section>
    </div>
  );
}
