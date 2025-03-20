import { useState } from "react";
import { Trade, User, Account } from "../../../types";
import { useGlobalState } from "../../../contexts/GlobalContext";
import styles from "./signin.module.css";

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const { API_ADDRESS, setIsUserManage, setUser, setCurrentAccount, setTrades } = useGlobalState();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await fetch(`${API_ADDRESS}/api/signin`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		const data = await res.json();

		// check for valid response
		if (!res.ok) {
			setFeedbackMessage(data.message);
			return;
		}

		// if valid user, get user data
		try {
			// Using fetch to get the data from your backend
			const response = await fetch(`${API_ADDRESS}/api/users/${data.userId}/full`);
			setFeedbackMessage("");

			// check for valid response
			if (!response.ok) return;

			// Convert the response to JSON
			const userData = await response.json();

			// Assuming the structure of data matches the User type
			const updatedUser: User = {
				userId: userData.user_id,
				username: userData.username,
				password: userData.password,
				accounts: userData.accounts.map(
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
										entryPrice: Number(trade.entry_price),
										exitPrice: Number(trade.exit_price),
										contracts: Number(trade.contracts),
										fees: Number(trade.fees),
										profit: Number(trade.profit),
									} as Trade)
							),
						} as Account)
				),
			};

			// save to session storage
			sessionStorage.setItem("user", JSON.stringify(updatedUser));

			// Set globals
			setUser(() => {
				setCurrentAccount(() => {
					const acc = updatedUser.accounts[0] || null;
					sessionStorage.setItem("currentAccount", JSON.stringify(acc));

					setTrades(() => {
						sessionStorage.setItem("trades", JSON.stringify(acc.trades));
						return acc.trades;
					});

					return acc;
				});
				return updatedUser;
			});

			setIsUserManage(false);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	return (
		<form className={styles.container} onSubmit={handleSignIn}>
			<button className={styles.close_button} onClick={() => setIsUserManage(false)}>
				X
			</button>
			<h1 className={styles.title}>Sign In</h1>
			<div className={styles.user_input}>
				<input type="text" className={styles.input_field} placeholder="Username" maxLength={12} onInput={(e) => setUsername(e.currentTarget.value)} required />
				<input type="password" className={styles.input_field} placeholder="Password" maxLength={20} onInput={(e) => setPassword(e.currentTarget.value)} required />
			</div>
			<p className={styles.feed_back_message}>{feedbackMessage}</p>
			<button type="submit" className={styles.signin_button}>
				Sign In
			</button>
		</form>
	);
}
