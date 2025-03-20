import { useState } from "react";
import { Trade, User, Account } from "../../types";
import { useGlobalState } from "../../contexts/GlobalContext";
import styles from "./signin.module.css";

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { API_ADDRESS, setIsUserManage, setUser, setCurrentAccount } = useGlobalState();

	const handleSignIn = async () => {
		const res = await fetch(`${API_ADDRESS}/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		if (res.ok) {
			try {
				// Using fetch to get the data from your backend
				const response = await fetch(`${API_ADDRESS}/api/users/${data.user_id}/full`);

				if (!response.ok) return;

				// Convert the response to JSON
				const useData = await response.json();

				// Assuming the structure of data matches the User type
				const updatedUser: User = {
					userId: useData.user_id,
					username: useData.username,
					password: useData.password,
					accounts: useData.accounts.map(
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

				// Set globals
				setUser(() => {
					setCurrentAccount(updatedUser.accounts[0] || null);
					return updatedUser;
				});
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		} else {
			alert(data.message);
		}

		setIsUserManage(false);
	};

	return (
		<form className={styles.container}>
			<button className={styles.close_button} onClick={() => setIsUserManage(false)}>
				X
			</button>
			<h1 className={styles.title}>Sign In</h1>
			<div className={styles.user_input}>
				<input type="username" className={styles.input_field} placeholder="Username" maxLength={12} onInput={(e) => setUsername(e.currentTarget.value)} />
				<input type="password" className={styles.input_field} placeholder="Password" maxLength={20} onInput={(e) => setPassword(e.currentTarget.value)} />
			</div>
			<button className={styles.signin_button} onClick={handleSignIn}>
				Sign In
			</button>
		</form>
	);
}
