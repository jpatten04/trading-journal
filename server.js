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

// Get a user with all their accounts and trades
app.get("/api/users/:userId/full", async (req, res) => {
	const { userId } = req.params;
	try {
		// First, fetch the user information
		const [userRows] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);
		if (userRows.length === 0) {
			return res.status(404).send("User not found");
		}
		const user = userRows[0];

		// Fetch all accounts for the user
		const [accountRows] = await db.query("SELECT * FROM accounts WHERE user_id = ?", [userId]);

		// For each account, fetch the corresponding trades
		for (let account of accountRows) {
			const [tradeRows] = await db.query("SELECT * FROM trades WHERE account_id = ?", [account.account_id]);
			account.trades = tradeRows;
		}

		// Now attach accounts to the user object
		user.accounts = accountRows;

		// Return the full user data with accounts and trades
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// --- USERS ---

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
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.delete("/api/accounts/:accountId/trades/:tradeId", async (req, res) => {
	const { tradeId } = req.params;

	try {
		await db.execute("DELETE FROM trades WHERE trade_id = ?", [tradeId]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Start Server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
