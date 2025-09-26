import s from "../AppSection.module.css";

export function TripExpensesPage() {
  return (
    <div className={s.page}>
      <section className={s.card}>
        <h2 className={s.cardTitle}>Trip expenses</h2>
        <p className={s.text}>Display a per-segment breakdown with category totals, currency conversions, and receipts.</p>
        <p className={s.text}>Add hooks to the global expense tracker so updates stay in sync.</p>
      </section>
    </div>
  );
}
