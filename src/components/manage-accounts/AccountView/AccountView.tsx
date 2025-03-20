import { Account } from "../../../types";
import { useGlobalState } from "../../../contexts/GlobalContext";
import styles from "./accountview.module.css";

interface Props {
	account: Account;
	removeAccount: (accountId: number) => void;
}

const AccountView = ({ account, removeAccount }: Props) => {
	const { currentAccount, setCurrentAccount, setTrades } = useGlobalState();

	const selectAccount = () => {
		setCurrentAccount(account);
		sessionStorage.setItem("currentAccount", JSON.stringify(account));

		const newTrades = account.trades || [];
		setTrades(newTrades);
		sessionStorage.setItem("trades", JSON.stringify(newTrades));
	};

	return (
		<div className={`${styles.accounts} ${account.accountId == currentAccount?.accountId && styles.selected}`} onClick={selectAccount}>
			<h1 className={styles.account_name}>{account.accountName}</h1>
			<button className={styles.remove_button} onClick={() => removeAccount(account.accountId)}>
				Remove
			</button>
		</div>
	);
};

export default AccountView;
