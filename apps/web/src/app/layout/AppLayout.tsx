// app/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../../components/layout/AppSidebar/AppSidebar";
import { ScrollToTop } from "./ScrollToTop";
import s from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={s.shell}>
      <ScrollToTop />
      <AppSidebar />
      <div className={s.body}>
        <header className={s.topbar}>
          <span className={s.topbarTitle}>TripPlannerHQ</span>
          <span className={s.topbarSubtitle}>Welcome back</span>
        </header>
        <main className={s.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
