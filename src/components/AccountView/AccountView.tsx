import styles from "./accountview.module.css";

interface Props {
	accountName: string;
}

const AccountView = ({ accountName }: Props) => {
	return (
		<div className={styles.accounts}>
			<h1 className={styles.account_name}>{accountName}</h1>
		</div>
	);
};

export default AccountView;
