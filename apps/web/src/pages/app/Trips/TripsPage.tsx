import { Link } from "react-router-dom";
import s from "../AppSection.module.css";

export function TripsPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>My Trips</h1>
        <p className={s.subtitle}>Browse all upcoming and past adventures, track budgets, and jump into trip details.</p>
      </header>

      <section className={`${s.cards} ${s.twoColumn}`}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Trip roster</h2>
          <p className={s.text}>Show a sortable list of trips with dates, destination, and budget progress.</p>
          <p className={s.text}>Include quick actions for viewing the itinerary or logging an expense.</p>
        </article>

        <article className={s.card}>
          <h2 className={s.cardTitle}>Create trip CTA</h2>
          <p className={s.text}>Surface a button to start a new trip and capture basic information like dates, travelers, and target budget.</p>
          <Link to="/app/trips/new" className={s.link}>Plan a new trip →</Link>
        </article>
      </section>
    </div>
  );
}
