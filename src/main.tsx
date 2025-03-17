import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage/AccountsPage.tsx";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage.tsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.tsx";
import "./global.css";

// navigation links
const router = createBrowserRouter([
	{
		path: "/",
		element: <AccountsPage />,
	},
	{
		path: "/accounts",
		element: <AccountsPage />,
	},
	{
		path: "/statistics",
		element: <StatisticsPage />,
	},
	{
		path: "/calendar",
		element: <CalendarPage />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
