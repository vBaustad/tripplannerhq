import s from "./Hero.module.css";
import { ArrowRight, MapPin, Heart } from "lucide-react";
import { Button } from "../../../components/Button";

export function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      {/* overlays */}
      <div className={s.overlayGradient} aria-hidden="true" />
      <div className={s.overlayVignette} aria-hidden="true" />
      {/* NEW: soft fade into white */}
      <div className={s.bottomFade} aria-hidden="true" />

      {/* decorative blobs */}
      <div className={s.deco} aria-hidden="true">
        <div className={s.bubbleTopRight} />
        <div className={s.bubbleLeftMid} />
        <div className={s.bubbleBottomLeft} />
        <div className={s.bubbleRightLower} />
      </div>

      {/* content */}
      <div className={s.container}>
        <div className={s.grid}>
          {/* Left */}
          <div className={s.left}>
            <div className={s.badge} aria-label="Expense-first Trip Planner">
              <Heart aria-hidden="true" />
              Expense-first Trip Planner
            </div>

            <div className={s.stack}>
              <h1 className={s.title} id="hero-title">
                Take Control of <span className={s.gradientText1}>Every Trip</span> with{" "}
                <span className={s.gradientText2}>Budgets & Insights</span>
              </h1>

              <p className={s.subtitle}>
                TripPlannerHQ centralizes your itinerary, daily spending, and prep work. Track pre-trip purchases, log every meal and ride, keep packing lists and calendars synced, and get gentle nudges when a city or category drifts off budget.
              </p>
            </div>

            <div className={s.ctaRow}>
              <Button variant="primary" size="lg" to="/signup" className={`${s.btnPrimary} ${s.btnLg}`}>
                Start 14-day Trial
                <ArrowRight style={{ marginLeft: 8 }} />
              </Button>

              <Button variant="secondary" size="lg" to="/demo" className={`${s.btnSecondary} ${s.btnLg}`}>
                See How It Works
              </Button>
            </div>

            <div className={s.stats} role="list" aria-label="Key highlights">
              <div className={s.stat} role="listitem">
                <div className={s.statValuePrimary}>3-in-1</div>
                <div className={s.statLabel}>Planner + Budget + Insights</div>
              </div>
              <div className={s.stat} role="listitem">
                <div className={s.statValueSecondary}>Daily</div>
                <div className={s.statLabel}>Expense Tracker</div>
              </div>
              <div className={s.stat} role="listitem">
                <div className={s.statValueTertiary}>Per-stop</div>
                <div className={s.statLabel}>Stay Budgets</div>
              </div>
            </div>
          </div>

          {/* Right (app mockup) */}
          <div className={`${s.right} ${s.fadeInUp}`} style={{ animationDelay: "0.3s" }}>
            <img
              src="/images/drone-view-small-islands.jpg"
              alt="TripPlannerHQ dashboard with itinerary and budget"
              className={s.phoneImg}
            />

            <div className={`${s.floatingCard} ${s.floatingCardTopLeft}`} style={{ animationDelay: "1s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin aria-hidden="true" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Vacation to Bali</span>
              </div>
            </div>

            <div className={`${s.floatingCard} ${s.floatingCardBottomRight}`} style={{ animationDelay: "1.5s" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Under budget by $456</div>
            </div>

            <div className={s.dotPrimary} />
            <div className={s.dotQuaternary} />
          </div>
        </div>
      </div>
    </section>
  );
}


