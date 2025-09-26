import s from "../AppSection.module.css";

export function TripAccommodationsPage() {
  return (
    <div className={s.page}>
      <section className={s.card}>
        <h2 className={s.cardTitle}>Accommodations</h2>
        <p className={s.text}>Summarize lodging bookings with nightly rates, confirmation numbers, and check-in details.</p>
        <p className={s.text}>Add placeholders for map embeds or links to booking providers.</p>
      </section>
    </div>
  );
}
