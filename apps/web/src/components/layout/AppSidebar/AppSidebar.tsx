import { NavLink } from "react-router-dom";
import { Gauge, CreditCard, User } from "lucide-react";
import s from "./AppSidebar.module.css";

const navItems = [
  { to: "/app", label: "Dashboard", icon: Gauge },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/account", label: "Account", icon: User },
];

export function AppSidebar() {
  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div className={s.logo}>TP</div>
        <div className={s.brandText}>
          <span className={s.brandName}>TripPlannerHQ</span>
          <span className={s.brandTagline}>Plan. Budget. Go.</span>
        </div>
      </div>

      <nav className={s.nav}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
