import { useState } from "react";
import { Trade } from "../../types";
import styles from "./tradeform.module.css";

interface Props {
	addTrade: (trade: Trade) => void;
}

// calculate profit by symbol
const pricePerPoint: Record<string, number> = {
	NQ: 20,
	MNQ: 2,
	ES: 50,
	MES: 5,
};

const TradeForm = ({ addTrade }: Props) => {
	const [trade, setTrade] = useState<Trade>({
		tradeId: 0,
		date: "",
		symbol: "NQ",
		direction: "long",
		entryPrice: 0,
		exitPrice: 0,
		contracts: 0,
		fees: 0,
		profit: 0,
	});

	// when a form option is changed
	const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
		const target = e.target as HTMLInputElement | HTMLSelectElement;
		setTrade({ ...trade, [target.name]: target.value });
	};

	// add trade to trades
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// calculate profit
		const tradeProfit = (trade.exitPrice - trade.entryPrice) * (trade.direction == "long" ? 1 : -1) * pricePerPoint[trade.symbol] * trade.contracts - trade.fees;

		// add trade with profit
		addTrade({ ...trade, profit: tradeProfit });

		// reset trade data and form
		setTrade({ tradeId: 0, date: "", symbol: "NQ", direction: "long", entryPrice: 0, exitPrice: 0, contracts: 0, fees: 0, profit: 0 });
		(e.target as HTMLFormElement).reset();
	};

	return (
		<form className={styles.content} onSubmit={handleSubmit}>
			<input type="date" name="date" className={styles.input} onInput={handleChange} required />
			<select name="symbol" className={styles.select} onInput={handleChange}>
				<option className={styles.option} value="NQ">
					NQ
				</option>
				<option className={styles.option} value="MNQ">
					MNQ
				</option>
				<option className={styles.option} value="ES">
					ES
				</option>
				<option className={styles.option} value="MES">
					MES
				</option>
			</select>
			<select name="direction" className={styles.select} onInput={handleChange}>
				<option className={styles.option} value="long">
					Long
				</option>
				<option className={styles.option} value="short">
					Short
				</option>
			</select>
			<input type="number" name="entryPrice" className={styles.input} placeholder="Entry Price" step={0.01} onInput={handleChange} required />
			<input type="number" name="exitPrice" className={styles.input} placeholder="Exit Price" step={0.01} onInput={handleChange} required />
			<input type="number" name="contracts" className={styles.input} placeholder="Contracts" onInput={handleChange} required />
			<input type="number" name="fees" className={styles.input} placeholder="Fees" step={0.01} onInput={handleChange} required />
			<button type="submit" className={styles.button}>
				Add
			</button>
		</form>
	);
};

export default TradeForm;
