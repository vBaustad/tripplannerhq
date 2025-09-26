import s from "../AppSection.module.css";

export function TripPackingPage() {
  return (
    <div className={s.page}>
      <section className={s.card}>
        <h2 className={s.cardTitle}>Packing</h2>
        <p className={s.text}>Organize packing lists by traveler or category and track what’s packed versus pending.</p>
        <p className={s.text}>Reserve space for pro-only AI packing suggestions.</p>
      </section>
    </div>
  );
}
