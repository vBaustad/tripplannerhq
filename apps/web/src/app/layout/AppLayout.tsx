// app/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import s from "./AppLayout.module.css";
export function AppLayout() {
  return (
    <div className={s.shell}>
      <div className={s.content}>
        <header className={s.topbar}>{/* user menu later */}</header>
        <main className={s.main}><Outlet /></main>
      </div>
    </div>
  );
}
