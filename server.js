import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "whale123",
	database: "trading_journal",
	waitForConnections: true,
	connectionLimit: 10,
});

// --- USERS ---
app.post("/api/register", async (req, res) => {
	const { username, password } = req.body;
	try {
		const [existingUser] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
		if (existingUser.length > 0) {
			return res.status(400).json({ message: "Username already in use" });
		}

		const [result] = await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
		res.status(201).json({ message: "User registered" });
	} catch (err) {
		console.error("Error registering user: ", err);
		res.status(500).send("Server error");
	}
});

app.post("/api/login", async (req, res) => {
	const [username, password] = req.body;
	try {
		const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
		if (users.length == 0) {
			return res.status(400).json({ message: "Invalid username or password" });
		}

		const user = users[0];
		if (password != user.password) {
			return res.status(400).json({ message: "Invalid username or password" });
		}

		res.json({ message: "Login successful", userId: user.user_id, username: username, password: password });
	} catch (err) {
		console.error("Error signing in: ", err);
		res.status(500).send("Server error");
	}
});

app.get("/api/users/:userId/full", async (req, res) => {
	const { username } = req.params;
	try {
		// First, fetch the user information
		const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
		if (users.length === 0) {
			return res.status(404).send("User not found");
		}
		const user = users[0];

		// Fetch all accounts for the user
		const [accounts] = await db.execute("SELECT * FROM accounts WHERE user_id = ?", [user.user_id]);

		// For each account, fetch the corresponding trades
		for (let acc of accounts) {
			const [trades] = await db.execute("SELECT * FROM trades WHERE account_id = ?", [acc.account_id]);
			acc.trades = trades;
		}

		// Now attach accounts to the user object
		user.accounts = accounts;

		// Return the full user data with accounts and trades
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// --- ACCOUNTS ---

// --- TRADES ---
app.post("/api/accounts/:accountId/trades", async (req, res) => {
	const { accountId } = req.params;
	const { date, symbol, direction, entryPrice, exitPrice, contracts, fees, profit } = req.body;

	try {
		await db.execute("INSERT INTO trades (account_id, date, symbol, direction, entry_price, exit_price, contracts, fees, profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			accountId,
			date,
			symbol,
			direction,
			entryPrice,
			exitPrice,
			contracts,
			fees,
			profit,
		]);

		res.status(201).json({ message: "Trade added successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.delete("/api/accounts/:accountId/trades/:tradeId", async (req, res) => {
	const { tradeId } = req.params;

	try {
		await db.execute("DELETE FROM trades WHERE trade_id = ?", [tradeId]);

		res.status(201).json({ message: "Trade removed successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Start Server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
