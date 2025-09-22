import { createBrowserRouter } from "react-router-dom";
import { MarketingLayout } from "./layout/MarketingLayout";
import { AppLayout } from "./layout/AppLayout";
import { LandingPage } from "../pages/marketing/Landing/LandingPage";

export const router = createBrowserRouter([
    {
        element: <MarketingLayout/>,
        children: [
            { index: true, element: <LandingPage/> },
            // { path: "pricing", element: <PricingPage/>}
        ]
    },
    {
        element: <AppLayout />,
        children: [
        ]
    },
    // { path: "*", element: <NotFoundPage /> },
])