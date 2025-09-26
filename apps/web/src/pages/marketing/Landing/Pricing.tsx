import { Check, Sparkles } from "lucide-react";
import { Button } from "../../../components/Button";
import s from "./Pricing.module.css";

const plans = [
  {
    name: "Explorer",
    price: "$9.99",
    period: "/month",
    description: "Perfect for solo travelers and weekend getaways",
    features: [
      "Plan up to 3 active trips at a time",
      "Daily expense tracker with per-day summaries",
      "Packing lists and pre-trip checklist templates",
      "Stay and meal budgeting worksheets",
      "Calendar export for travel days",
    ],
    popular: false,
  },
  {
    name: "Adventurer",
    price: "$19.99",
    period: "/month",
    description: "Ideal for families or frequent explorers",
    features: [
      "Unlimited trips and itinerary segments",
      "Shared dashboards for travel companions",
      "Smart spending alerts and suggestions",
      "Collaborative packing lists and reminders",
      "Offline-ready expense exports (CSV & PDF)",
      "Inbox summaries after each travel day",
    ],
    popular: true,
  },
  {
    name: "Globetrotter",
    price: "$39.99",
    period: "/month",
    description: "Built for travel planners and group leaders",
    features: [
      "Everything in Adventurer",
      "Client workspaces with custom branding",
      "Bulk expense import and approval flows",
      "Team roles with permissions",
      "Group itinerary and budget exports",
      "Priority chat support",
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className={s.section} id="pricing">
      <div className="container">
        <header className={s.header}>
          <div className={s.badge}>
            <Sparkles size={16} />
            Flexible Plans
          </div>
          <h2 className={s.title}>Choose the plan that fits your next adventures</h2>
          <p className={s.subtitle}>
            Start planning smarter trips today. All plans include our budgeting tools, itinerary builder, calendar view, and planning assistant with no hidden fees.
          </p>
        </header>

        <div className={s.grid}>
          {plans.map((plan) => (
            <article key={plan.name} className={`${s.card} ${plan.popular ? s.popular : ""}`}>
              {plan.popular ? (
                <div className={s.ribbon}>
                  <Sparkles size={14} /> Most popular
                </div>
              ) : null}

              <div>
                <h3 className={s.planName}>{plan.name}</h3>
                <p className={s.planDescription}>{plan.description}</p>
                <div className={s.priceRow}>
                  <span className={s.price}>{plan.price}</span>
                  <span className={s.period}>{plan.period}</span>
                </div>
              </div>

              <ul className={s.featureList}>
                {plan.features.map((feature) => (
                  <li key={feature} className={s.featureItem}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={s.cta}>
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="lg"
                  to="/signup"
                >
                  {plan.popular ? "Start free trial" : "Get started"}
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className={s.note}>All plans include a 14-day free trial. Cancel anytime. Have feedback? <a href="https://tripplannerhq.userjot.com/" target="_blank" rel="noreferrer"><span className="notranslate">Tell us what you need</span></a>.</p>
      </div>
    </section>
  );
}


