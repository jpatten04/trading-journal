import { Link } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
	return (
		<div className={styles.header}>
			<div className={styles.header_left}>
				<h1 className={styles.title}>
					<Link to={"/"} className={styles.link}>
						Trading Journal
					</Link>
				</h1>
				<div className={styles.page_buttons}>
					<Link to={"/accounts"} className={styles.link}>
						Accounts
					</Link>
					<Link to={"/statistics"} className={styles.link}>
						Statistics
					</Link>
					<Link to={"/calendar"} className={styles.link}>
						Calendar
					</Link>
				</div>
			</div>
			<div className={styles.header_buttons}>
				<button className={styles.button}>Import</button>
				<button className={styles.button}>Export</button>
			</div>
		</div>
	);
};

export default Header;
