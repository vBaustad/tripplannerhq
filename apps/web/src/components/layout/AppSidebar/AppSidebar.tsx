import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import { Gauge, MapPinned, Receipt, Backpack, Sparkle, CalendarClock, User, CreditCard, Settings } from "lucide-react";
import s from "./AppSidebar.module.css";

type NavItem = { to: string; label: string; icon: ComponentType<{ size?: number }> };

const primaryNav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: Gauge },
  { to: "/app/trips", label: "Trips", icon: MapPinned },
  { to: "/app/expenses", label: "Expenses", icon: Receipt },
  { to: "/app/packing", label: "Packing", icon: Backpack },
  { to: "/app/insights", label: "Insights / AI", icon: Sparkle },
  { to: "/app/pre-trip", label: "Pre-Trip", icon: CalendarClock },
];

const utilityNav: NavItem[] = [
  { to: "/app/account/profile", label: "Profile", icon: User },
  { to: "/app/account/subscription", label: "Subscription", icon: Settings },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/account", label: "Account Overview", icon: User },
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
        <span className={s.navHeader}>Plan</span>
        {primaryNav.map(({ to, label, icon: Icon }) => (
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

        <span className={s.navHeader}>Account</span>
        {utilityNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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
