import { TradeStats } from "../../../types";
import styles from "./winrate.module.css";

interface Props {
	tradeStats: TradeStats;
}

export default function WinRate({ tradeStats }: Props) {
	return (
		<div className={styles.content}>
			<div className={styles.top}>
				<h4 className={styles.win_rate_title}>Win Rate</h4>
				<h1 className={styles.win_rate_data}>{Number(tradeStats.winRate || 0).toFixed(2)}%</h1>
			</div>
			<div className={styles.bottom}>
				<div className={styles.wins_losses}>
					<div className={styles.wins}>
						<h4 className={styles.wins_title}>Total Wins</h4>
						<h1 className={`${styles.wins_data} positive`}>{tradeStats.wins}</h1>
					</div>
					<div className={styles.losses}>
						<h4 className={styles.losses_title}>Total Losses</h4>
						<h1 className={`${styles.losses_data} negative`}>{tradeStats.losses}</h1>
					</div>
				</div>
				<div className={styles.win_rate_line}>
					<div className={styles.green_line} style={{ width: `${tradeStats.totalTrades > 0 ? (tradeStats.wins / tradeStats.totalTrades) * 100 : 0}%` }}></div>
					<div className={styles.red_line} style={{ width: `${tradeStats.totalTrades > 0 ? (tradeStats.losses / tradeStats.totalTrades) * 100 : 0}%` }}></div>
				</div>
			</div>
		</div>
	);
}
