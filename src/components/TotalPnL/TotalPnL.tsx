import { TradeStats } from "../../types";
import styles from "./totalpnl.module.css";

interface Props {
	tradeStats: TradeStats;
}

export default function TotalPnL({ tradeStats }: Props) {
	return (
		<div className={styles.content}>
			<div className={styles.top}>
				<h4 className={styles.pnl_title}>Total PnL</h4>
				<h1 className={`${styles.pnl_data} ${tradeStats.totalPnL > 0 ? "positive" : tradeStats.totalPnL < 0 ? "negative" : ""}`}>${Number(tradeStats.totalPnL || 0).toFixed(2)}</h1>
			</div>
			<div className={styles.bottom}>
				<div className={styles.profit_loss}>
					<div className={styles.profit}>
						<h4 className={styles.profit_title}>Total Profit</h4>
						<h1 className={`${styles.profit_data} positive`}>${Number(tradeStats.totalProfit || 0).toFixed(2)}</h1>
					</div>
					<div className={styles.loss}>
						<h4 className={styles.loss_title}>Total Loss</h4>
						<h1 className={`${styles.loss_date} negative`}>${Number(tradeStats.totalLoss || 0).toFixed(2)}</h1>
					</div>
				</div>
				<div className={styles.profit_loss_line}>
					<div className={styles.green_line} style={{ width: `${tradeStats.totalTrades > 0 ? (tradeStats.totalProfit / (tradeStats.totalProfit - tradeStats.totalLoss)) * 100 : 0}%` }}></div>
					<div className={styles.red_line} style={{ width: `${tradeStats.totalTrades > 0 ? (-tradeStats.totalLoss / (tradeStats.totalProfit - tradeStats.totalLoss)) * 100 : 0}%` }}></div>
				</div>
			</div>
		</div>
	);
}
