import { Navigate, createBrowserRouter } from "react-router-dom";
import { MarketingLayout } from "./layout/MarketingLayout";
import { AppLayout } from "./layout/AppLayout";
import { LandingPage } from "../pages/marketing/Landing/LandingPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/app/Dashboard/DashboardPage";
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
          { path: "billing", element: <BillingPage /> },
          { path: "account", element: <AccountPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
