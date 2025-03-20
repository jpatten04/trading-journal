import { useEffect, useMemo } from "react";
import Header from "../../components/Header/Header";
import TradeForm from "../../components/TradeForm/TradeForm";
import TradeHistory from "../../components/TradeHistory/TradeHistory";
import TotalPnL from "../../components/stats/TotalPnL/TotalPnL";
import BiggestWinLoss from "../../components/stats/BiggestWinLoss/BiggestWinLoss";
import ProfitChart from "../../components/stats/ProfitChart/ProfitChart";
import AvgWinLoss from "../../components/stats/AvgWinLoss/AvgWinLoss";
import WinRate from "../../components/stats/WinRate/WinRate";
import { useGlobalState } from "../../contexts/GlobalContext";
import { Account, Trade, TradeStats } from "../../types";
import styles from "./statisticspage.module.css";

export default function StatisticsPage() {
	const { API_ADDRESS, currentAccount, setCurrentAccount, trades, setTrades } = useGlobalState();

	// get all trades on load
	useEffect(() => {
		if (currentAccount) {
			const newTrades = currentAccount.trades || [];
			setTrades(newTrades);
			sessionStorage.setItem("trades", JSON.stringify(newTrades));
		}
	}, [currentAccount]);

	// add trade to database
	const addTrade = async (trade: Trade) => {
		// check if user has active account
		if (!currentAccount) {
			alert("Must create an account being entering a trade.");
			return;
		}

		try {
			const response = await fetch(`${API_ADDRESS}/api/accounts/${currentAccount?.accountId}/trades`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(trade),
			});

			// check for valid response
			if (!response.ok) {
				const errorMessage = await response.text();
				alert("Failed to add trade: " + errorMessage);
				return;
			}

			// get response data
			const data = await response.json();

			// update trades state
			setTrades((prevTrades: Trade[]) => {
				const updatedTrades = [...prevTrades, data.trade];
				sessionStorage.setItem("trades", JSON.stringify(updatedTrades));
				return updatedTrades;
			});

			// update current account state
			setCurrentAccount((prevAccount: Account) => {
				const updatedAccount = { ...prevAccount, trades: [...prevAccount.trades, data.trade] };
				sessionStorage.setItem("currentAccount", JSON.stringify(updatedAccount));
				return updatedAccount;
			});
		} catch (err) {
			console.error("Error adding trade: ", err);
		}
	};

	// remove trade from database
	const removeTrade = async (tradeId: number) => {
		try {
			const response = await fetch(`${API_ADDRESS}/api/accounts/${currentAccount?.accountId}/trades/${tradeId}`, {
				method: "DELETE",
			});

			if (!response.ok) return;

			// update trades state
			setTrades((prevTrades: Trade[]) => {
				const updatedTrades = prevTrades.filter((trade) => trade.tradeId !== tradeId);
				sessionStorage.setItem("trades", JSON.stringify(updatedTrades));
				return updatedTrades;
			});

			// update current account state
			setCurrentAccount((prevAccount: Account) => {
				const updatedAccount = { ...prevAccount, trades: prevAccount.trades.filter((trade) => trade.tradeId !== tradeId) };
				sessionStorage.setItem("currentAccount", JSON.stringify(updatedAccount));
				return updatedAccount;
			});
		} catch (err) {
			console.error("Error removing trade: ", err);
		}
	};

	// recalculate stats whenever trade is added or removed
	const tradeStats: TradeStats = useMemo(() => {
		if (!trades)
			return {
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
			};

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

		return {
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
		};
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
					<ProfitChart trades={trades || []}></ProfitChart>
				</div>
				<TradeForm addTrade={addTrade}></TradeForm>
				<TradeHistory removeTrade={removeTrade}></TradeHistory>
			</div>
		</div>
	);
}
