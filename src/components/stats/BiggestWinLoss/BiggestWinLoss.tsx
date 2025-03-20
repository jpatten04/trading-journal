import { TradeStats } from "../../../types";
import styles from "./biggestwinloss.module.css";

interface Props {
	tradeStats: TradeStats;
}

export default function BiggestWinLoss({ tradeStats }: Props) {
	return (
		<div className={styles.content}>
			<div className={styles.top}>
				<h4 className={styles.win_title}>Biggest Win</h4>
				<h1 className={`${styles.win_data} positive`}>${Number(tradeStats.biggestWin).toFixed(2)}</h1>
			</div>
			<div className={styles.bottom}>
				<h4 className={styles.loss_title}>Biggest Loss</h4>
				<h1 className={`${styles.loss_data} negative`}>${Number(tradeStats.biggestLoss).toFixed(2)}</h1>
			</div>
		</div>
	);
}
