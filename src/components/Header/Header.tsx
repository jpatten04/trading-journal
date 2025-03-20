import { Link } from "react-router-dom";
import Register from "../manage-user/Register/Register";
import SignIn from "../manage-user/SignIn/SignIn";
import { useGlobalState } from "../../contexts/GlobalContext";
import styles from "./header.module.css";

const Header = () => {
	const { isUserManage, setIsUserManage, user, setUser, setCurrentAccount } = useGlobalState();

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();

		// clear session storage
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("trades");
		sessionStorage.removeItem("currentAccount");

		// clear globals
		setUser(null);
		setCurrentAccount(null);
	};

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
				<h2 className={styles.username_display} style={!user ? { display: "none" } : { display: "block" }}>
					{user?.username}
				</h2>
				<button className={styles.button} style={!user ? { display: "none" } : { display: "block" }} onClick={handleLogout}>
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
