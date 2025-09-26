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
        <main className={s.main}>
          <div className={s.surface}>
            <div className={s.surfaceContent}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
