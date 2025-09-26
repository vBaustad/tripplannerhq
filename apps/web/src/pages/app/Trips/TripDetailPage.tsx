import { Link, NavLink, Outlet } from "react-router-dom";
import s from "../AppSection.module.css";
import detailStyles from "./TripDetailPage.module.css";

const tabs = [
  { to: "segments", label: "Segments" },
  { to: "expenses", label: "Expenses" },
  { to: "packing", label: "Packing" },
  { to: "accommodations", label: "Accommodations" },
];

export function TripDetailPage() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Trip Overview</h1>
        <p className={s.subtitle}>Deep dive into a single trip’s itinerary, costs, and packing progress.</p>
      </header>

      <nav className={detailStyles.tabBar}>
        {tabs.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `${detailStyles.tab} ${isActive ? detailStyles.active : ""}`}>
            {tab.label}
          </NavLink>
        ))}
        <Link to="/app/trips" className={detailStyles.backLink}>
          ← Back to trips
        </Link>
      </nav>

      <div className={detailStyles.contentShell}>
        <Outlet />
      </div>
    </div>
  );
}
