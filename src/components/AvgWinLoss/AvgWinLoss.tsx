import { TradeStats } from "../../pages/StatisticsPage/StatisticsPage";
import styles from "./avgwinloss.module.css";

interface Props {
	tradeStats: TradeStats;
}

export default function AvgWinLoss({ tradeStats }: Props) {
	return (
		<div className={styles.content}>
			<div className={styles.top}>
				<h4 className={styles.win_title}>Average Win</h4>
				<h1 className={`${styles.win_data} positive`}>${Number(tradeStats.averageWin).toFixed(2)}</h1>
			</div>
			<div className={styles.bottom}>
				<h4 className={styles.loss_title}>Average Loss</h4>
				<h1 className={`${styles.loss_data} negative`}>${Number(tradeStats.averageLoss).toFixed(2)}</h1>
			</div>
		</div>
	);
}
