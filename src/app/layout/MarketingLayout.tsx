// app/layout/MarketingLayout.tsx
import { Outlet } from "react-router-dom";
export function MarketingLayout() {
  return (
    <>
    
      <main>
        <Outlet />
      </main>

      <footer>© {new Date().getFullYear()} VP</footer>
    </>
  );
}
