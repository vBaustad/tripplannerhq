import { AppShowcase } from "./AppShowcase";
import { CTA } from "./CTA";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Testimonials } from "./Testimonials";

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <AppShowcase />
      <Pricing />
      <Testimonials />
      <CTA />
    </>
  );
}
