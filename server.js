import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "whale123",
	database: "trading_journal",
	waitForConnections: true,
	connectionLimit: 10,
});

// Get all users
app.get("/api/users", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM users");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// Create a new user
app.post("/api/users", async (req, res) => {
	const { username, email } = req.body;
	try {
		const [result] = await pool.query("INSERT INTO users (username, email) VALUES (?, ?)", [username, email]);
		res.status(201).json(result);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// Get all accounts for a user
app.get("/api/users/:userId/accounts", async (req, res) => {
	const { userId } = req.params;
	try {
		const [rows] = await pool.query("SELECT * FROM accounts WHERE user_id = ?", [userId]);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// Create a new account for a user
app.post("/api/users/:userId/accounts", async (req, res) => {
	const { userId } = req.params;
	const { account_name } = req.body;
	try {
		const [result] = await pool.query("INSERT INTO accounts (user_id, account_name) VALUES (?, ?)", [userId, account_name]);
		res.status(201).json(result);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// Get all trades for an account
app.get("/api/accounts/:accountId/trades", async (req, res) => {
	const { accountId } = req.params;
	try {
		const [rows] = await pool.query("SELECT account_id, date, symbol, direction, entryPrice, exitPrice, contracts, fees, profit FROM trades WHERE account_id = ?", [accountId]);

		const formattedTrades = rows.map((trade) => ({
			...trade,
			date: trade.date.toISOString().split("T")[0],
			profit: parseFloat(trade.profit),
		}));

		res.json(formattedTrades);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

// Add a new trade to an account
app.post("/api/accounts/:accountId/trades", async (req, res) => {
	const { accountId } = req.params;
	const { date, symbol, direction, entryPrice, exitPrice, contracts, fees, profit } = req.body;
	try {
		const [result] = await pool.query("INSERT INTO trades (account_id, date, symbol, direction, entryPrice, exitPrice, contracts, fees, profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
		res.status(201).json(result);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
