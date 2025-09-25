import { Calendar, CheckCircle, DollarSign, Globe, ListChecks, UtensilsCrossed } from "lucide-react";
import s from "../Landing/LandingSections.module.css"; // import as a module

const features = [
  {
    icon: Globe,
    title: "Plan Multi-Stop Trips",
    description:
      "Break journeys into segments with their own itinerary, dates, and shared notes - perfect for multi-city adventures.",
    color: "quaternary",
  },
  {
    icon: DollarSign,
    title: "Daily Expense Tracking",
    description:
      "Log meals, transport, activities, and shopping by day. See category totals, daily averages, and remaining budget instantly.",
    color: "secondary",
  },
  {
    icon: UtensilsCrossed,
    title: "Stay & Dining Budgets",
    description:
      "Capture per-place costs for food, lodging, and transfers so every stop has a clear spend ceiling before you arrive.",
    color: "tertiary",
  },
  {
    icon: ListChecks,
    title: "Pre-Trip Prep & Packing",
    description:
      "Track deposits, gear purchases, and build collaborative packing lists so nothing gets forgotten on travel day.",
    color: "sunset",
  },
  {
    icon: Calendar,
    title: "Timeline & Reminders",
    description:
      "Sync a visual calendar that highlights travel days, check-ins, and activities while surfacing prep tasks due soon.",
    color: "primary",
  },
  {
    icon: CheckCircle,
    title: "Insights Assistant",
    description:
      "Receive gentle prompts when a location drifts over budget and get curated ideas for places to eat or explore next.",
    color: "coral",
  },
];

export function Features() {
  return (
    <section className={s.featuresSection} id="features">
      {/* We are keeping these nodes but they are hidden in CSS (you can bring them back later if needed) */}
      <div className={s.featuresBackground} />
      <div className={s.featuresDecorative}>
        <div className={s.featuresDecorative1} />
        <div className={s.featuresDecorative2} />
      </div>

      <div className="container">
        <div className={s.featuresHeader}>
          <div className={s.featuresBadge}>Web App Features</div>
          <h2 className={s.featuresTitle}>
            Everything You Need for <span className={s.featuresTitleGradient}>Confident Trips</span>
          </h2>
          <p className={s.featuresDescription}>
            Build itineraries, track spending, and stay organized from the first booking to the flight home with one workspace for your travel crew.
          </p>
        </div>

        <div className={s.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={[
                s.featureCard,
                s[f.color as keyof typeof s],
                (i === 0 || i === 3) ? s.large : "",
                s.fadeInUp,
              ].filter(Boolean).join(" ")}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={[s.featureDecorative, s[f.color as keyof typeof s]].join(" ")} />
              <div className={[s.featureIcon, s[f.color as keyof typeof s]].join(" ")}>
                <f.icon />
              </div>
              <div>
                <h3 className={s.featureTitle}>{f.title}</h3>
                <p className={s.featureDescription}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


