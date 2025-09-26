import s from "../Landing/LandingSections.module.css";
import { CheckCircle, Clock, Sparkles } from "lucide-react";

export function AppShowcase() {
  return (
    <section className={s.appShowcase} aria-labelledby="app-showcase-title">
      <div className={s.appShowcaseBackground} aria-hidden="true" />

      <div className="container">
        <header className={s.appShowcaseHeader}>
          <div className={s.appShowcaseBadge}>Product Demo</div>
          <h2 className={s.appShowcaseTitle} id="app-showcase-title">
            See <span className={s.appShowcaseTitleGradient}>TripPlannerHQ</span> in Action
          </h2>
          <p className={s.appShowcaseDescription}>
            Build a multi-stop itinerary, add stays and expenses, and watch summaries adjust automatically. Your dashboard surfaces total spend, per-day averages, and category breakdowns in seconds.
          </p>
        </header>

        <div className={s.showcaseGrid}>
          {/* Media column */}
          <div className={s.mediaCol}>
            {/* Browser mockup */}
            <div className={s.browserFrame}>
              <div className={s.windowBar} aria-hidden="true">
                <span className={`${s.winDot} ${s.red}`} />
                <span className={`${s.winDot} ${s.yellow}`} />
                <span className={`${s.winDot} ${s.green}`} />
                <span className={s.windowTitle}>TripPlannerHQ</span>
              </div>

              <img
                src="/images/city-view-afternoon.jpg"
                alt="Dashboard with itinerary and budget overview"
                className={s.browserImage}
                loading="lazy"
                decoding="async"
              />

              <div className={`${s.floatingChip} ${s.chipTopLeft}`}>
                <Sparkles size={16} />
                Daily summary ready
              </div>
              <div className={`${s.floatingChip} ${s.chipBottomRight}`}>
                Saved $482
              </div>
            </div>

            {/* Phone mockups */}
            <div className={s.deviceRow}>
              <div className={s.phoneFrame}>
                <img
                  src="/images/beach-bungalow-palms.jpg"
                  alt="Segment editor with stays and notes"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={s.phoneFrame}>
                <img
                  src="/images/white-buildings-ocean-view.jpg"
                  alt="Budget breakdown by category"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Copy/steps column */}
          <div className={s.copyCol}>
            <ol className={s.stepList}>
              <li className={s.stepItem}>
                <div className={`${s.stepIcon} ${s.isPrimary}`}>1</div>
                <div className={s.stepBody}>
                  <h3 className={s.stepTitle}>Create Trip & Segments</h3>
                  <p className={s.stepText}>
                    Add cities and dates, then split your journey into segments with their own plans, budget, and notes -
                    perfect for multi-city adventures.
                  </p>
                </div>
              </li>

              <li className={s.stepItem}>
                <div className={`${s.stepIcon} ${s.isTertiary}`}>2</div>
                <div className={s.stepBody}>
                  <h3 className={s.stepTitle}>Add Stays, Plans & Expenses</h3>
                  <p className={s.stepText}>
                    Store accommodation details and log expenses in real time. Totals and per-day averages update
                    automatically with clear category breakdowns.
                  </p>
                </div>
              </li>

              <li className={s.stepItem}>
                <div className={`${s.stepIcon} ${s.isQuaternary}`}>3</div>
                <div className={s.stepBody}>
                  <h3 className={s.stepTitle}>Review Insights & Suggestions</h3>
                  <p className={s.stepText}>
                    See gentle prompts for overspending, suggested spots to eat or explore, and recap packing gaps before you go.
                  </p>
                </div>
              </li>
            </ol>

            <ul className={s.points}>
              <li><CheckCircle size={18} /> Multi-city planner</li>
              <li><CheckCircle size={18} /> Daily expense tracking</li>
              <li><CheckCircle size={18} /> Suggestions for eats & activities</li>
              <li><CheckCircle size={18} /> Clear totals & per-day averages</li>
            </ul>

            <div className={s.tip}>
              <Clock size={16} />
              <div>
                <strong>Pro Tip:</strong> The more details you add (interests, budgets, trip type), the more tailored TripPlannerHQ guidance becomes. Coming soon: exportable trip reports & collaboration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

