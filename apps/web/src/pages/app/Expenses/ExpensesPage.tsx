import s from "../AppSection.module.css";

export function ExpensesPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Expense Tracker</h1>
        <p className={s.subtitle}>Log expenses, monitor category totals, and stay on top of your travel budget.</p>
      </header>

      <section className={`${s.cards} ${s.twoColumn}`}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Logging</h2>
          <p className={s.text}>Provide a form for quick expense entry with currency, segment, and category pickers.</p>
          <p className={s.text}>Show a running table that can be filtered by traveler or trip segment.</p>
        </article>

        <article className={s.card}>
          <h2 className={s.cardTitle}>Reports</h2>
          <p className={s.text}>Visualize budget vs. actual spending, category pie charts, and configurable alerts.</p>
          <p className={s.text}>(Pro) Add buttons to export PDFs or spreadsheets.</p>
        </article>
      </section>
    </div>
  );
}
