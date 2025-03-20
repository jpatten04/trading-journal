import { useState } from "react";
import { Account } from "../../../types";
import { useGlobalState } from "../../../contexts/GlobalContext";
import styles from "./createaccount.module.css";

export default function CreateAccount() {
	const [accountName, setAccountName] = useState("");

	const { API_ADDRESS, user, setUser, setCurrentAccount, setIsCreatingAccount, setTrades } = useGlobalState();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// check if user is signed in
		if (!user) {
			alert("Must sign in before creating an account.");
			return;
		}

		const res = await fetch(`${API_ADDRESS}/api/accounts`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId: user.userId, accountName }),
		});

		const data = await res.json();

		// check if valid response
		if (!res.ok) return;

		// initialize new account
		const newAccount: Account = { accountId: data.accountId, accountName: data.accountName, trades: [] };

		// update globals
		setCurrentAccount(() => {
			sessionStorage.setItem("currentAccount", JSON.stringify(newAccount));
			return newAccount;
		});
		setTrades(() => {
			sessionStorage.setItem("trades", JSON.stringify([]));
			return [];
		});
		setUser(() => {
			const newUser = { ...user, accounts: [...user.accounts, newAccount] };
			sessionStorage.setItem("user", JSON.stringify(newUser));
			return newUser;
		});

		setIsCreatingAccount(false);
	};

	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			<div className={styles.close_button} onClick={() => setIsCreatingAccount(false)}>
				X
			</div>
			<h1 className={styles.title}>Create Account</h1>
			<input type="text" className={styles.account_name_input} placeholder="Account name" maxLength={15} onInput={(e) => setAccountName(e.currentTarget.value)} required />
			<button type="submit" className={styles.create_button}>
				Create
			</button>
		</form>
	);
}
