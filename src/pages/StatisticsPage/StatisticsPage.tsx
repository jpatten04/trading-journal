import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import TradeForm from "../../components/TradeForm/TradeForm";
import TradeHistory from "../../components/TradeHistory/TradeHistory";
import TotalPnL from "../../components/TotalPnL/TotalPnL";
import BiggestWinLoss from "../../components/BiggestWinLoss/BiggestWinLoss";
import ProfitChart from "../../components/ProfitChart/ProfitChart";
import AvgWinLoss from "../../components/AvgWinLoss/AvgWinLoss";
import WinRate from "../../components/WinRate/WinRate";
import { useGlobalState } from "../../contexts/GlobalContext";
import { Trade, TradeStats } from "../../types";
import styles from "./statisticspage.module.css";

export default function StatisticsPage() {
	const [tradeStats, setTradeStats] = useState<TradeStats>({
		totalProfit: 0,
		totalLoss: 0,
		totalPnL: 0,
		wins: 0,
		losses: 0,
		winRate: 0,
		biggestWin: 0,
		biggestLoss: 0,
		averageWin: 0,
		averageLoss: 0,
		totalTrades: 0,
	});

	const { API_ADDRESS, currentAccount, trades, setTrades } = useGlobalState();

	// get all trades on load
	useEffect(() => {
		setTrades(currentAccount.trades);
	}, [currentAccount.trades]);

	// add trade to database
	const addTrade = async (trade: Trade) => {
		await fetch(`${API_ADDRESS}/api/accounts/${currentAccount.accountId}/trades`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(trade),
		})
			.then((newTrade) => setTrades((prevTrades: Trade[]) => [...prevTrades, newTrade]))
			.catch((err) => console.log("Error adding trade: ", err));
	};

	// remove trade from database
	const removeTrade = async (tradeId: number) => {
		await fetch(`${API_ADDRESS}/api/accounts/${currentAccount.accountId}/trades/${tradeId}`, {
			method: "DELETE",
		})
			.then(() => setTrades((prevTrades: Trade[]) => prevTrades.filter((trade) => trade.tradeId != tradeId)))
			.catch((err) => console.error("Error removing trade: ", err));
	};

	// remove all trades from database
	const clearTrades = () => {};

	// recalculate stats whenever trade is added or removed
	useEffect(() => {
		if (trades.length > 0) console.log(trades);

		let wins = 0;
		let losses = 0;
		let totalProfit = 0;
		let totalLoss = 0;
		let biggestWin = 0;
		let biggestLoss = 0;

		trades.forEach((trade: Trade) => {
			if (trade.profit > 0) {
				wins++;
				totalProfit += trade.profit;
				if (trade.profit > biggestWin) {
					biggestWin = trade.profit;
				}
			} else {
				losses++;
				totalLoss += trade.profit;
				if (trade.profit < biggestLoss) {
					biggestLoss = trade.profit;
				}
			}
		});

		const totalPnL = totalProfit + totalLoss;
		const totalTrades = trades.length;
		const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
		const averageWin = wins > 0 ? totalProfit / wins : 0;
		const averageLoss = losses > 0 ? totalLoss / losses : 0;

		setTradeStats({
			totalProfit: totalProfit,
			totalLoss: totalLoss,
			totalPnL: totalPnL,
			wins: wins,
			losses: losses,
			winRate: winRate,
			biggestWin: biggestWin,
			biggestLoss: biggestLoss,
			averageWin: averageWin,
			averageLoss: averageLoss,
			totalTrades: totalTrades,
		});
	}, [trades]);

	return (
		<div className={`${styles.page} page`}>
			<Header></Header>
			<div className={`${styles.content} page-content`}>
				<h1 className={styles.title}>Statistics</h1>
				<div className={styles.statistics}>
					<TotalPnL tradeStats={tradeStats}></TotalPnL>
					<BiggestWinLoss tradeStats={tradeStats}></BiggestWinLoss>
					<WinRate tradeStats={tradeStats}></WinRate>
					<AvgWinLoss tradeStats={tradeStats}></AvgWinLoss>
					<ProfitChart trades={trades}></ProfitChart>
				</div>
				<TradeForm addTrade={addTrade}></TradeForm>
				<TradeHistory removeTrade={removeTrade} clearTrades={clearTrades}></TradeHistory>
			</div>
		</div>
	);
}
