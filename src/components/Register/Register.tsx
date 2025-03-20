import { useState } from "react";
import { useGlobalState } from "../../contexts/GlobalContext";
import styles from "./register.module.css";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { API_ADDRESS, setIsUserManage, setUser } = useGlobalState();

	const handleRegister = async () => {
		const res = await fetch(`${API_ADDRESS}/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		if (res.ok) {
			setUser({
				userId: data.userId,
				username: data.username,
				password: data.password,
				accounts: [],
			});
		} else {
			alert(data.message);
		}

		setIsUserManage(false);
	};

	return (
		<form className={styles.container}>
			<button className={styles.close_button} onClick={() => setIsUserManage(false)}>
				X
			</button>
			<h1 className={styles.title}>Register</h1>
			<div className={styles.user_input}>
				<input type="username" className={styles.input_field} placeholder="Username" maxLength={12} onInput={(e) => setUsername(e.currentTarget.value)} />
				<input type="password" className={styles.input_field} placeholder="Password" maxLength={20} onInput={(e) => setPassword(e.currentTarget.value)} />
			</div>
			<button className={styles.register_button} onClick={handleRegister}>
				Register
			</button>
		</form>
	);
}
