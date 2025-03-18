import { useState, useMemo, useEffect } from "react";
import { Trade } from "../../pages/StatisticsPage/StatisticsPage";
import { Chart, ChartData, ChartOptions } from "chart.js/auto";
import styles from "./profitchart.module.css";

interface Props {
	trades: Trade[];
}

export default function ProfitChart({ trades }: Props) {
	const [filter, setFilter] = useState("by-trade");

	// get all data for chart
	const chartData: ChartData<"line"> = useMemo(() => {
		let data: number[] = [];
		let labels: (string | number)[] = [];

		if (filter == "by-trade") {
			let cumulative = 0;
			trades.forEach((trade, index) => {
				cumulative += trade.profit;
				data.push(cumulative);
				labels.push(index + 1);
			});
		} else if (filter == "by-day") {
			let dailyProfit: Record<string, number> = {};
			trades.forEach((trade) => {
				dailyProfit[trade.date] = (dailyProfit[trade.date] || 0) + trade.profit;
			});

			let cumulative = 0;
			Object.keys(dailyProfit).forEach((date) => {
				cumulative += dailyProfit[date];
				data.push(cumulative);
				labels.push(date);
			});
		}

		return {
			labels: labels,
			datasets: [
				{
					label: "Cumulative PnL ($)",
					data: data,
					borderColor: "#222",
					backgroundColor: "green",
					pointBackgroundColor: data.map((value) => (value >= 0 ? "green" : "red")),
					fill: {
						target: "origin",
						above: "green",
						below: "red",
					},
					pointRadius: 3,
				},
			],
		};
	}, [trades, filter]);

	// custom options for chart
	const chartOptions: ChartOptions<"line"> = {
		responsive: true,
		scales: {
			x: {
				title: { display: true, text: filter == "by-trade" ? "Trade" : "Date", color: "white" },
				ticks: { color: "white" },
			},
			y: {
				title: { display: true, text: "Profit ($)", color: "white" },
				ticks: { color: "white" },
			},
		},
		plugins: {
			legend: { labels: { color: "white" } },
		},
	};

	useEffect(() => {
		let chart = new Chart("chart", { type: "line", data: chartData, options: chartOptions });

		return () => {
			chart.destroy();
		};
	}, [chartData]);

	// remove previous chart

	return (
		<div className={styles.content}>
			<div className={styles.header}>
				<h2 className={styles.title}>Profit Chart</h2>
				<select className={styles.filter} onInput={(e: React.FormEvent<HTMLSelectElement>) => setFilter((e.target as HTMLSelectElement).value)}>
					<option value="by-trade">By Trade</option>
					<option value="by-day">By Day</option>
				</select>
			</div>
			<canvas id="chart"></canvas>
		</div>
	);
}
