import { useState } from "react";
import Header from "../../components/Header/Header";
import AccountView from "../../components/AccountView/AccountView";
import styles from "./accountspage.module.css";

export default function AccountsPage() {
	const [selectedAccount, setSelectedAccount] = useState("");

	return (
		<div className={`${styles.page} page`}>
			<Header></Header>
			<div className={`${styles.content} page-content`}>
				<div className={styles.header}>
					<h1>Accounts</h1>
					<button className={styles.add_new_button}>+Add New</button>
				</div>
				<div className={styles.accounts}>
					<AccountView accountName="TakeProfitTrader1" setSelected={setSelectedAccount}></AccountView>
					<AccountView accountName="TakeProfitTrader2" setSelected={setSelectedAccount}></AccountView>
					<AccountView accountName="TakeProfitTrader3" setSelected={setSelectedAccount}></AccountView>
				</div>
			</div>
		</div>
	);
}
