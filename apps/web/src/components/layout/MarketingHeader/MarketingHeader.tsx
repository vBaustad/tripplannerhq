import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../Button";
import s from "./MarketingHeader.module.css";

export function MarketingHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const isLanding = pathname === "/";
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";

  const baseScrolled = !isLanding;
  const [scrolled, setScrolled] = useState(baseScrolled);

  useEffect(() => {
    const evaluate = () => {
      setScrolled(baseScrolled || window.scrollY > 12);
    };

    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => window.removeEventListener("scroll", evaluate);
  }, [baseScrolled]);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const barClass = [s.bar, scrolled ? s.scrolled : ""].filter(Boolean).join(" ");

  return (
    <header className={barClass}>
      <Link to="/" className={s.brand} aria-label="TripPlannerHQ home" onClick={handleLogoClick}>
        TripPlannerHQ
      </Link>

      {isLanding ? (
        <>
          <nav className={s.nav} aria-label="Primary">
            <a className={s.link} href="#features">Features</a>
            <a className={s.link} href="#pricing">Pricing</a>
            <a className={s.link} href="#testimonials">Testimonials</a>
          </nav>

          <div className={s.ctaGroup}>
            <Button variant="ghost" size="sm" to="/login">
              Log in
            </Button>
            <Button variant="primary" size="sm" to="/signup">
              Sign up
            </Button>
          </div>
        </>
      ) : (
        <div className={s.ctaGroup}>
          <Button variant="ghost" size="sm" to="/">
            Home
          </Button>
          {isLogin ? (
            <Button variant="primary" size="sm" to="/signup">
              Sign up
            </Button>
          ) : isSignup ? (
            <Button variant="primary" size="sm" to="/login">
              Log in
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login">
                Log in
              </Button>
              <Button variant="primary" size="sm" to="/signup">
                Sign up
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
