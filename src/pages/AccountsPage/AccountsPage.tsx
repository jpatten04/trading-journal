import Header from "../../components/Header/Header";
import AccountView from "../../components/manage-accounts/AccountView/AccountView";
import CreateAccount from "../../components/manage-accounts/CreateAccount/CreateAccount";
import { useGlobalState } from "../../contexts/GlobalContext";
import styles from "./accountspage.module.css";

export default function AccountsPage() {
	const { API_ADDRESS, user, setUser, currentAccount, setCurrentAccount, isCreatingAccount, setIsCreatingAccount } = useGlobalState();

	const removeAccount = async (accountId: number) => {
		await fetch(`${API_ADDRESS}/api/accounts/${accountId}`, {
			method: "DELETE",
		})
			.then(() => {
				setUser(() => {
					const newUser = { ...user, accounts: user?.accounts.filter((acc) => acc.accountId != accountId) || [] };
					sessionStorage.setItem("user", JSON.stringify(newUser));
					if (currentAccount?.accountId == accountId) {
						setCurrentAccount(() => {
							const acc = newUser.accounts[0] || [];
							sessionStorage.setItem("currentAccount", JSON.stringify(acc));
							return acc;
						});
					}
					return newUser;
				});
			})
			.catch((err) => console.error("Error removing account: ", err));
	};

	return (
		<div className={`${styles.page} page`}>
			<Header></Header>
			<div className={`${styles.content} page-content`}>
				<div className={styles.header}>
					<h1>Accounts</h1>
					<button className={styles.add_new_button} onClick={() => setIsCreatingAccount(true)}>
						+Add New
					</button>
				</div>
				<div className={styles.accounts}>
					{user?.accounts.map((account, index) => (
						<AccountView account={account} removeAccount={removeAccount} key={index}></AccountView>
					))}
				</div>
				{isCreatingAccount && <div className={styles.overlay}></div>}
				<div className={styles.accounts}>{isCreatingAccount && <CreateAccount></CreateAccount>}</div>
			</div>
		</div>
	);
}
