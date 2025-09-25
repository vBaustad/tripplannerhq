// app/layout/MarketingLayout.tsx
import { Outlet } from "react-router-dom";
import { Footer } from "../../components/layout/Footer/Footer";
import { MarketingHeader } from "../../components/layout/MarketingHeader/MarketingHeader";

export function MarketingLayout() {
  return (
    <>
      <MarketingHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
