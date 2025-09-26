import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider";

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

type MaybeSubscriptionUser = {
  subscriptionStatus?: string | null;
  subscriptionPriceId?: string | null;
} | null;

function hasActiveSubscription(user: MaybeSubscriptionUser) {
  if (!user) return false;
  const status = typeof user.subscriptionStatus === "string" ? user.subscriptionStatus.toLowerCase() : null;
  if (status && ACTIVE_STATUSES.has(status)) {
    return true;
  }
  if (typeof user.subscriptionPriceId === "string" && user.subscriptionPriceId.trim().length > 0) {
    return true;
  }
  return false;
}

export function RequireSubscription() {
  const { user } = useAuth();
  const location = useLocation();

  if (hasActiveSubscription(user)) {
    return <Outlet />;
  }

  return <Navigate to="/app/billing" replace state={{ from: location.pathname + location.search }} />;
}
