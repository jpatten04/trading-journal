import styles from "./accountview.module.css";

interface Props {
	accountName: string;
	setSelected: (name: string) => void;
}

const AccountView = ({ accountName, setSelected }: Props) => {
	return (
		<div className={styles.accounts} onClick={() => setSelected(accountName)}>
			<h1 className={styles.account_name}>{accountName}</h1>
		</div>
	);
};

export default AccountView;
