import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import TradeForm from "../../components/TradeForm/TradeForm";
import TradeHistory from "../../components/TradeHistory/TradeHistory";
import TotalPnL from "../../components/TotalPnL/TotalPnL";
import BiggestWinLoss from "../../components/BiggestWinLoss/BiggestWinLoss";
import ProfitChart from "../../components/ProfitChart/ProfitChart";
import AvgWinLoss from "../../components/AvgWinLoss/AvgWinLoss";
import WinRate from "../../components/WinRate/WinRate";
import styles from "./statisticspage.module.css";

export interface Trade {
	date: string;
	symbol: string;
	direction: string;
	entryPrice: number;
	exitPrice: number;
	contracts: number;
	fees: number;
	profit: number;
}

export interface TradeStats {
	totalProfit: number;
	totalLoss: number;
	totalPnL: number;
	wins: number;
	losses: number;
	winRate: number;
	biggestWin: number;
	biggestLoss: number;
	averageWin: number;
	averageLoss: number;
	totalTrades: number;
}

export default function StatisticsPage() {
	const [trades, setTrades] = useState<Trade[]>([]);
	const [tradeStats, setTradeStats] = useState({
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

	// add new trade to trades
	const addTrade = (trade: Trade) => {
		// update trades
		setTrades([...trades, trade]);
	};

	// remove trade from trades
	const removeTrade = (index: number) => {
		setTrades((prevTrades) => prevTrades.filter((_, i) => i != index));
	};

	// remove all trades from trades
	const clearTrades = () => {
		setTrades([]);
	};

	// calculate stats whenever trade is added or removed
	useEffect(() => {
		let wins = 0;
		let losses = 0;
		let totalProfit = 0;
		let totalLoss = 0;
		let biggestWin = 0;
		let biggestLoss = 0;

		trades.forEach((trade) => {
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
				<TradeHistory trades={trades} removeTrade={removeTrade} clearTrades={clearTrades}></TradeHistory>
			</div>
		</div>
	);
}
