import s from "../AppSection.module.css";

export function ProfilePage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Profile & Preferences</h1>
        <p className={s.subtitle}>Manage personal details, password, and default currency.</p>
      </header>

      <section className={s.cards}>
        <article className={s.card}>
          <h2 className={s.cardTitle}>Profile form</h2>
          <p className={s.text}>Provide inputs for name, email, and password updates with validation feedback.</p>
          <p className={s.text}>Offer a dropdown for preferred currency that cascades to expenses.</p>
        </article>
      </section>
    </div>
  );
}
