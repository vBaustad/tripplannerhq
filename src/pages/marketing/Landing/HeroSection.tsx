import s from "./Hero.module.css";
import { ArrowRight, MapPin, Heart } from "lucide-react";
// Adjust this path to wherever your Button lives:
import { Button } from "../../../components/Button"

export function HeroSection() {
  return (
    <section className={s.hero}>
      {/* overlays */}
      <div className={s.overlayGradient} />
      <div className={s.overlayVignette} />

      {/* decorative blobs */}
      <div className={s.deco}>
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
            <div className={s.badge}>
              <Heart />
              AI-Powered Dream Trips ✨
            </div>

            <div className={s.stack}>
              <h1 className={s.title}>
                Your Next <span className={s.gradientText1}>Adventure</span> Awaits with{" "}
                <span className={s.gradientText2}>AI Magic</span>
              </h1>

              <p className={s.subtitle}>
                Turn your travel dreams into reality! Our AI creates magical itineraries, discovers hidden
                paradise spots, and saves you money. Just tell us where your heart wants to go, and we&apos;ll
                handle the rest! 🌴
              </p>
            </div>

            <div className={s.ctaRow}>
              <Button className={`${s.btnPrimary} ${s.btnLg}`}>
                Let&apos;s Plan Something Amazing!
                <ArrowRight style={{ marginLeft: 8 }} />
              </Button>

              <Button className={`${s.btnSecondary} ${s.btnLg}`}>See the Magic ✨</Button>
            </div>

            <div className={s.stats}>
              <div className={s.stat}>
                <div className={s.statValuePrimary}>50K+</div>
                <div className={s.statLabel}>Dream Trips</div>
              </div>
              <div className={s.stat}>
                <div className={s.statValueSecondary}>4.9★</div>
                <div className={s.statLabel}>Happy Travelers</div>
              </div>
              <div className={s.stat}>
                <div className={s.statValueTertiary}>200+</div>
                <div className={s.statLabel}>Paradise Spots</div>
              </div>
            </div>
          </div>

          {/* Right (app mockup) */}
          <div className={`${s.right} ${s.fadeInUp}`} style={{ animationDelay: "0.3s" }}>
            <img
              src="/modern-smartphone-showing-vacation-planning-app-in.jpg"
              alt="Vacation Planner App Interface"
              className={s.phoneImg}
            />

            <div className={`${s.floatingCard} ${s.floatingCardTopLeft}`} style={{ animationDelay: "1s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Bali Paradise 🏝️</span>
              </div>
            </div>

            <div className={`${s.floatingCard} ${s.floatingCardBottomRight}`} style={{ animationDelay: "1.5s" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>$1,247 saved! 💰</div>
            </div>

            <div className={s.dotPrimary} />
            <div className={s.dotQuaternary} />
          </div>
        </div>
      </div>
    </section>
  );
}
