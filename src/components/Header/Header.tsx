import { Link } from "react-router-dom";
import Register from "../Register/Register";
import SignIn from "../SignIn/SignIn";
import { useGlobalState } from "../../contexts/GlobalContext";
import styles from "./header.module.css";

const Header = () => {
	const { isUserManage, setIsUserManage, user } = useGlobalState();
	return (
		<div className={styles.header}>
			<div className={styles.header_left}>
				<h1 className={styles.title}>Trading Journal</h1>
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
			<div className={styles.manage_user_buttons}>
				<button className={styles.button} style={user ? { display: "none" } : { display: "block" }} onClick={() => setIsUserManage({ isRegistering: true, isSigningIn: false })}>
					Register
				</button>
				<button className={styles.button} style={user ? { display: "none" } : { display: "block" }} onClick={() => setIsUserManage({ isRegistering: false, isSigningIn: true })}>
					Sign In
				</button>
				<button className={styles.button} style={user ? { display: "none" } : { display: "block" }} onClick={() => setIsUserManage(false)}>
					Logout
				</button>
			</div>
			{(isUserManage.isRegistering || isUserManage.isSigningIn) && <div className={styles.overlay}></div>}
			{isUserManage.isRegistering && <Register></Register>}
			{isUserManage.isSigningIn && <SignIn></SignIn>}
		</div>
	);
};

export default Header;
