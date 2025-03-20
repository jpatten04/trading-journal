import { Route, Routes } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage/AccountsPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<AccountsPage />} />
			<Route path="/accounts" element={<AccountsPage />} />
			<Route path="/statistics" element={<StatisticsPage />} />
			<Route path="/calendar" element={<CalendarPage />} />
		</Routes>
	);
}
