// app/layout/MarketingLayout.tsx
import { Outlet } from "react-router-dom";
import { Footer } from "../../components/layout/Footer/Footer";
import { MarketingHeader } from "../../components/layout/MarketingHeader/MarketingHeader";
import { ScrollToTop } from "./ScrollToTop";

export function MarketingLayout() {
  return (
    <>
      <ScrollToTop />
      <MarketingHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
