import Header from "../../components/Header/Header";
import AccountView from "../../components/AccountView/AccountView";
import styles from "./accountspage.module.css";

export default function AccountsPage() {
	return (
		<div className={`${styles.page} page`}>
			<Header></Header>
			<div className={`${styles.content} page-content`}>
				<div className={styles.header}>
					<h1>Accounts</h1>
					<button className={styles.add_new_button}>+Add New</button>
				</div>
				<div className={styles.accounts}>
					<AccountView accountName="TakeProfitTrader1"></AccountView>
					<AccountView accountName="TakeProfitTrader2"></AccountView>
					<AccountView accountName="TakeProfitTrader3"></AccountView>
				</div>
			</div>
		</div>
	);
}
