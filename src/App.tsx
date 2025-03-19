import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage/AccountsPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import { User, Account, Trade } from "./types";
import { useGlobalState } from "./contexts/GlobalContext";

export default function App() {
	const { API_ADDRESS, setUser, setCurrentAccount } = useGlobalState();

	const tempUser = 1;

	// get all user data
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// Using fetch to get the data from your backend
				const response = await fetch(`${API_ADDRESS}/api/users/${tempUser}/full`);

				// Convert the response to JSON
				const data = await response?.json();

				// Assuming the structure of data matches the User type
				const updatedUser: User = {
					userId: data.user_id,
					username: data.username,
					accounts: data.accounts.map(
						(account: any) =>
							({
								accountId: account.account_id,
								accountName: account.account_name,
								trades: account.trades.map(
									(trade: any) =>
										({
											tradeId: trade.trade_id,
											date: trade.date.split("T")[0],
											symbol: trade.symbol,
											direction: trade.direction,
											entryPrice: trade.entry_price,
											exitPrice: trade.exit_price,
											contracts: trade.contracts,
											fees: trade.fees,
											profit: Number(trade.profit),
										} as Trade)
								),
							} as Account)
					),
				};

				// Set globals
				setUser(() => {
					setCurrentAccount(updatedUser.accounts[0] || null);
					return updatedUser;
				});
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		// Fetch the user data on component mount
		fetchUserData();
	}, []);

	return (
		<Routes>
			<Route path="/" element={<AccountsPage />} />
			<Route path="/accounts" element={<AccountsPage />} />
			<Route path="/statistics" element={<StatisticsPage />} />
			<Route path="/calendar" element={<CalendarPage />} />
		</Routes>
	);
}
