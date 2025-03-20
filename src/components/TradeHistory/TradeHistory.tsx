import { useGlobalState } from "../../contexts/GlobalContext";
import styles from "./tradehistory.module.css";

interface Props {
	removeTrade: (index: number) => void;
}

const TradeHistory = ({ removeTrade }: Props) => {
	const { trades } = useGlobalState();

	return (
		<div className={styles.content}>
			<div className={styles.content_header}>
				<h2 className={styles.content_title}>Trade History</h2>
			</div>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Symbol</th>
						<th>Direction</th>
						<th>Entry Price</th>
						<th>Exit Price</th>
						<th>Contracts</th>
						<th>Fees</th>
						<th>Profit</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{trades?.map((trade, index) => (
						<tr key={index}>
							<td>{trade.date}</td>
							<td>{trade.symbol}</td>
							<td
								style={{
									color: trade.direction == "long" ? "green" : "red",
								}}>
								{trade.direction}
							</td>
							<td>${Number(trade.entryPrice).toFixed(2)}</td>
							<td>${Number(trade.exitPrice).toFixed(2)}</td>
							<td>{trade.contracts}</td>
							<td>${Number(trade.fees).toFixed(2)}</td>
							<td style={{ color: trade.profit >= 0 ? "green" : "red" }}>${Number(trade.profit).toFixed(2)}</td>
							<td>
								<button onClick={() => removeTrade(trades[index].tradeId)}>Remove</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TradeHistory;
