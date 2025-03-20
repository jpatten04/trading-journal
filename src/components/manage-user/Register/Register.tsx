import { useState } from "react";
import { useGlobalState } from "../../../contexts/GlobalContext";
import styles from "./register.module.css";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const { API_ADDRESS, setIsUserManage, setUser } = useGlobalState();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await fetch(`${API_ADDRESS}/api/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		const data = await res.json();

		// check for valid response
		if (!res.ok) {
			setFeedbackMessage(data.message);
			return;
		}

		console.log(data);

		// set empty user data
		setUser({
			userId: data.userId,
			username: data.username,
			password: data.password,
			accounts: [],
		});

		setIsUserManage(false);
	};

	return (
		<form className={styles.container} onSubmit={handleRegister}>
			<button className={styles.close_button} onClick={() => setIsUserManage(false)}>
				X
			</button>
			<h1 className={styles.title}>Register</h1>
			<div className={styles.user_input}>
				<input type="text" className={styles.input_field} placeholder="Username" maxLength={12} onInput={(e) => setUsername(e.currentTarget.value)} required />
				<input type="password" className={styles.input_field} placeholder="Password" maxLength={20} onInput={(e) => setPassword(e.currentTarget.value)} required />
			</div>
			<p className={styles.feed_back_message}>{feedbackMessage}</p>
			<button type="submit" className={styles.register_button}>
				Register
			</button>
		</form>
	);
}
