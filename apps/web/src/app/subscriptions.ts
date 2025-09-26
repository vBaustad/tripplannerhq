const explorerId = import.meta.env.VITE_STRIPE_PLAN_EXPLORER_ID ?? "";
const adventurerId = import.meta.env.VITE_STRIPE_PLAN_ADVENTURER_ID ?? "";
const globetrotterId = import.meta.env.VITE_STRIPE_PLAN_GLOBETROTTER_ID ?? "";

export type SubscriptionPlan = {
  id: string;
  key: "explorer" | "adventurer" | "globetrotter";
  name: string;
  priceLabel: string;
  description: string;
};

const allPlans: SubscriptionPlan[] = [
  {
    id: explorerId,
    key: "explorer",
    name: "Explorer",
    priceLabel: "$9.99 / month",
    description: "Perfect for solo travelers and weekend getaways.",
  },
  {
    id: adventurerId,
    key: "adventurer",
    name: "Adventurer",
    priceLabel: "$19.99 / month",
    description: "Ideal for families or frequent explorers.",
  },
  {
    id: globetrotterId,
    key: "globetrotter",
    name: "Globetrotter",
    priceLabel: "$39.99 / month",
    description: "Built for travel planners and group leaders.",
  },
];

export const subscriptionPlans: SubscriptionPlan[] = allPlans.filter((plan) => plan.id.trim().length > 0);

export function getPlanById(id: string | null | undefined) {
  if (!id) return null;
  return subscriptionPlans.find((plan) => plan.id === id) ?? null;
}
