import s from "./Footer.module.css";
import { Link } from "react-router-dom";
// If you want a small CTA button in the footer, you can import your Button:
// import { Button } from "../../../components/Button";

const NAV: Record<string, Array<{ label: string; to: string }>> = {
  Product: [
    { label: "Features", to: "/#features" },
    { label: "Pricing", to: "/#pricing" },
    { label: "Roadmap", to: "https://tripplannerhq.userjot.com/" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Resources: [
    { label: "Docs", to: "/docs" },
    { label: "Changelog", to: "/changelog" },
    { label: "Blog", to: "/blog" },
    { label: "Help Center", to: "/help" },
  ],
  Legal: [
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className={s.footer}>
      {/* soft top divider / halo */}
      <div className={s.bg} aria-hidden="true" />

      <div className="container">
        <div className={s.top}>
          <div className={s.brand}>
            <Link to="/" className={s.logo} aria-label="TripPlannerHQ home">
              <span className={s.logoMark} aria-hidden="true">TP</span>
              <span className={s.logoText}>TripPlannerHQ</span>
            </Link>
            <p className={s.tagline}>
              Plan multi-stop trips, track expenses in real time, and get AI-powered insightsâ€”everything in one place.
            </p>

            {/* Socials */}
            <div className={s.socials}>
             
            </div>
          </div>

          {/* Nav */}
          <div className={s.grid}>
            {Object.entries(NAV).map(([group, links]) => (
              <div className={s.col} key={group}>
                <div className={s.heading}>{group}</div>
                <ul className={s.list}>
                  {links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className={s.link}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={s.bottom}>
          <div className={s.copy}>Â© {new Date().getFullYear()} TripPlannerHQ. All rights reserved.</div>
          <div className={s.meta}>
            <Link to="/privacy" className={s.metaLink}>Privacy</Link>
            <span className={s.dot} aria-hidden="true">â€¢</span>
            <Link to="/terms" className={s.metaLink}>Terms</Link>
            <span className={s.dot} aria-hidden="true">â€¢</span>
            <Link to="/contact" className={s.metaLink}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

