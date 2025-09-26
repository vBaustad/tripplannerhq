import { Navigate, createBrowserRouter } from "react-router-dom";
import { MarketingLayout } from "./layout/MarketingLayout";
import { AppLayout } from "./layout/AppLayout";
import { LandingPage } from "../pages/marketing/Landing/LandingPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/app/Dashboard/DashboardPage";
import { TripsPage } from "../pages/app/Trips/TripsPage";
import { TripCreatePage } from "../pages/app/Trips/TripCreatePage";
import { TripDetailPage } from "../pages/app/Trips/TripDetailPage";
import { TripSegmentsPage } from "../pages/app/Trips/TripSegmentsPage";
import { TripExpensesPage } from "../pages/app/Trips/TripExpensesPage";
import { TripPackingPage } from "../pages/app/Trips/TripPackingPage";
import { TripAccommodationsPage } from "../pages/app/Trips/TripAccommodationsPage";
import { ExpensesPage } from "../pages/app/Expenses/ExpensesPage";
import { PackingPage } from "../pages/app/Packing/PackingPage";
import { InsightsPage } from "../pages/app/Insights/InsightsPage";
import { PreTripPage } from "../pages/app/PreTrip/PreTripPage";
import { ProfilePage } from "../pages/app/Account/ProfilePage";
import { SubscriptionPage } from "../pages/app/Account/SubscriptionPage";
import { BillingPage } from "../pages/app/Billing/BillingPage";
import { AccountPage } from "../pages/app/Account/AccountPage";
import { RequireAuth } from "./routes/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MarketingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "trips", element: <TripsPage /> },
          { path: "trips/new", element: <TripCreatePage /> },
          {
            path: "trips/:tripId",
            element: <TripDetailPage />,
            children: [
              { index: true, element: <TripSegmentsPage /> },
              { path: "segments", element: <TripSegmentsPage /> },
              { path: "expenses", element: <TripExpensesPage /> },
              { path: "packing", element: <TripPackingPage /> },
              { path: "accommodations", element: <TripAccommodationsPage /> },
            ],
          },
          { path: "expenses", element: <ExpensesPage /> },
          { path: "packing", element: <PackingPage /> },
          { path: "insights", element: <InsightsPage /> },
          { path: "pre-trip", element: <PreTripPage /> },
          { path: "account/profile", element: <ProfilePage /> },
          { path: "account/subscription", element: <SubscriptionPage /> },
          { path: "billing", element: <BillingPage /> },
          { path: "account", element: <AccountPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
