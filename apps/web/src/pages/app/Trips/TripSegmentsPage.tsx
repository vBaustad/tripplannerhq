import s from "../AppSection.module.css";

export function TripSegmentsPage() {
  return (
    <div className={s.page}>
      <section className={s.card}>
        <h2 className={s.cardTitle}>Segments</h2>
        <p className={s.text}>Break the trip into travel blocks (e.g., Paris → Lyon) with transport details and dates.</p>
        <p className={s.text}>Show a timeline or list to quickly reorder or edit segments.</p>
      </section>
    </div>
  );
}
