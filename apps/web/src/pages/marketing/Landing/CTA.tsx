import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "../../../components/Button";
import s from "./CTA.module.css";

export function CTA() {
  return (
    <section className={s.section}>
      {/* subtle halos */}
      <div className={s.bg} />

      <div className="container">
        <div className={s.content}>
          <div className={s.badge}>
            <Sparkles />
            <span>14-day Trial - Full Access</span>
          </div>

          <h2 className={s.title}>Plan smarter trips with one tool.</h2>

          <p className={s.lede}>
            TripPlannerHQ combines multi-stop itineraries, daily expense tracking, and a planning assistant in one simple web app. See total cost, per-day averages, and helpful insights at a glance.
          </p>

          <div className={s.actions}>
            <Button variant="primary" size="lg" to="/signup" className={s.btnPrimary}>
              Start 14-day Trial
              <ArrowRight />
            </Button>

            <Button variant="secondary" size="lg" to="/demo" className={s.btnSecondary}>
              See How It Works
            </Button>
          </div>

          <div className={s.perks}>
            <span><Check /> Full access during trial</span>
            <span><Check /> Cancel anytime</span>
            <span><Check /> Budgeting & insights included</span>
          </div>
        </div>
      </div>
    </section>
  );
}

