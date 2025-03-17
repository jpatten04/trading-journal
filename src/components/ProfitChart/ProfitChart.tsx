import { Trade } from "../../pages/StatisticsPage/StatisticsPage";
import styles from "./profitchart.module.css";

interface Props {
	trades: Trade[];
}

export default function ProfitChart({ trades }: Props) {
	return (
		<div className={styles.content}>
			<h2>Profit Chart</h2>
		</div>
	);
}
