document.addEventListener("DOMContentLoaded", function () {
	// trade input form
	const tradeForm = document.querySelector(".trade-form");

	// trade history table
	const tradeTableBody = document.getElementById("tradeTableBody");

	// stats
	const totalPL = document.getElementById("pnl");
	const totalProfit = document.getElementById("total-profit");
	const totalLoss = document.getElementById("total-loss");
	const biggestWin = document.getElementById("biggest-win");
	const biggestLoss = document.getElementById("biggest-loss");
	const winRate = document.getElementById("win-rate");
	const totalWins = document.getElementById("total-wins");
	const totalLosses = document.getElementById("total-losses");
	const averageWin = document.getElementById("average-win");
	const averageLoss = document.getElementById("average-loss");
	const totalTrades = document.getElementById("totalTrades");

	// all trades
	let trades = JSON.parse(localStorage.getItem("trades")) || [];

	// Add New Trade
	tradeForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const date = document.getElementById("date").value;
		const symbol = document.getElementById("symbol").value;
		const direction = document.getElementById("direction").value;
		const entry = parseFloat(document.getElementById("entry").value);
		const exit = parseFloat(document.getElementById("exit").value);
		const contracts = parseInt(document.getElementById("contracts").value, 10);
		const fees = parseFloat(document.getElementById("fees").value);

		// get point mulitplier for different symbols
		let pointMult = 0;
		if (symbol === "NQ") pointMult = 20;
		else if (symbol === "MNQ") pointMult = 2;
		else if (symbol === "ES") pointMult = 50;
		else if (symbol === "MES") pointMult = 5;

		// calculate profit
		let profit = (exit - entry) * pointMult * contracts;
		if (direction === "short") profit *= -1;
		profit -= fees;

		// create trade and add to storage
		const trade = { date, symbol, direction, entry, exit, contracts, fees, profit };
		trades.push(trade);

		// sort trades by data
		trades.sort((a, b) => {
			let dateA = new Date(a.date);
			let dateB = new Date(b.date);
			return dateA - dateB;
		});
		localStorage.setItem("trades", JSON.stringify(trades));

		// updateTrades
		updateTrades();

		// clear all input
		tradeForm.reset();
	});

	// updates statistics
	function updateStats() {
		let totalP = 0;
		let totalL = 0;
		let wins = 0;
		let losses = 0;
		let biggestW = 0;
		let biggestL = 0;

		trades.forEach((trade) => {
			// update wins and losses, get total profit/loss
			if (trade.profit > 0) {
				wins++;
				totalP += trade.profit;
				if (trade.profit > biggestW) biggestW = trade.profit;
			} else {
				losses++;
				totalL += trade.profit;
				if (trade.profit < biggestL) biggestL = trade.profit;
			} // if
		});

		// update stats
		totalPL.textContent = `$${(totalP + totalL).toFixed(2)}`;
		totalProfit.textContent = `$${totalP.toFixed(2)}`;
		totalLoss.textContent = `$${totalL.toFixed(2)}`;
		document.querySelector(".pnl-line #profit").style.width = `${trades.length > 0 ? (totalP / (totalP - totalL)) * 100 : 0}%`;
		document.querySelector(".pnl-line #loss").style.width = `${trades.length > 0 ? (-totalL / (totalP - totalL)) * 100 : 0}%`;

		// change color of PnL
		if (totalP + totalL > 0) {
			totalPL.classList.remove("negative");
			totalPL.classList.add("positive");
		} else if (totalP + totalL < 0) {
			totalPL.classList.remove("positive");
			totalPL.classList.add("negative");
		} else {
			totalPL.classList.remove("positive");
			totalPL.classList.remove("negative");
		} // if

		biggestWin.textContent = `$${biggestW.toFixed(2)}`;
		biggestLoss.textContent = `$${biggestL.toFixed(2)}`;

		winRate.textContent = trades.length ? `${((wins / (wins + losses)) * 100).toFixed(2)}%` : "0.00%";
		totalWins.textContent = wins;
		totalLosses.textContent = losses;
		document.querySelector(".win-loss-line #wins").style.width = `${trades.length > 0 ? (wins / trades.length) * 100 : 0}%`;
		document.querySelector(".win-loss-line #losses").style.width = `${trades.length > 0 ? (losses / trades.length) * 100 : 0}%`;

		averageWin.textContent = wins > 0 ? `$${(totalP / wins).toFixed(2)}` : "$0.00";
		averageLoss.textContent = losses > 0 ? `$${(totalL / losses).toFixed(2)}` : "$0.00";

		totalTrades.textContent = `Total: ${trades.length}`;

		// update PnL chart and calendar
		updateProfitChart();
		updatePnLCalendar();
	} // updateStats

	// updates the PnL chart
	function updateProfitChart() {
		const canvas = document.getElementById("profit-chart").getContext("2d");
		const chartFilter = document.getElementById("chart-filter").value;

		let cumulativeProfit = 0;
		const profitData = [];
		const labels = [];
		let xAxis = "";

		// process data for chart
		if (chartFilter === "by-trade") {
			trades.forEach((trade, index) => {
				cumulativeProfit += trade.profit;
				labels.push(index + 1);
				profitData.push(cumulativeProfit);
			});
			xAxis = "Trade";
		} else if (chartFilter === "by-day") {
			let dailyProfit = {};
			trades.forEach((trade) => {
				dailyProfit[trade.date] = (dailyProfit[trade.date] || 0) + trade.profit;
			});

			Object.keys(dailyProfit).forEach((date) => {
				cumulativeProfit += dailyProfit[date];
				labels.push(date);
				profitData.push(cumulativeProfit);
			});
			xAxis = "Date";
		} // if

		if (window.profitChartInstance) {
			window.profitChartInstance.destroy();
		} // if

		// create chart
		window.profitChartInstance = new Chart(canvas, {
			type: "line",
			data: {
				labels: labels,
				datasets: [
					{
						label: "Cumulative Profit ($)",
						data: profitData,
						borderColor: "#222",
						backgroundColor: "green",
						pointBackgroundColor: profitData.map((value) => (value >= 0 ? "green" : "red")),
						fill: {
							target: "origin",
							above: "green",
							below: "red",
						},
						pointRadius: 3,
					},
				],
			}, // data
			options: {
				responsive: true,
				scales: {
					x: {
						title: { display: true, text: xAxis, color: "white" },
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
			}, // options
		});

		// makes updateProfitChart global
		window.updateProfitChart = updateProfitChart;
	} // updateProfitChart

	// update pnl calendar
	function updatePnLCalendar() {
		// gets daily and monthly pnl
		let dailyStats = {};
		let monthlyProfit = {};
		trades.forEach((trade) => {
			let dateKey = trade.date;
			let monthKey = `${dateKey.split("-")[0]}-${dateKey.split("-")[1]}`;

			if (!dailyStats[dateKey]) {
				dailyStats[dateKey] = { profit: 0, tradeCount: 0 };
			} // if

			// store pnl and trade count in object
			dailyStats[dateKey].profit += trade.profit;
			dailyStats[dateKey].tradeCount++;
			monthlyProfit[monthKey] = (monthlyProfit[monthKey] || 0) + trade.profit;
		});

		events = [];
		Object.keys(dailyStats).forEach((date) => {
			let { profit, tradeCount } = dailyStats[date];

			// pnl label
			events.push({
				title: `$${profit.toFixed(2)}`,
				start: date,
				color: profit > 0 ? "rgb(64, 121, 64)" : "rgb(129, 65, 65)",
				textColor: profit > 0 ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)",
			});

			// trade count label
			events.push({
				title: `${tradeCount} trades`,
				start: date,
				color: profit > 0 ? "rgb(64, 121, 64)" : "rgb(129, 65, 65)",
				textColor: "rgb(200, 200, 200)",
			});
		});

		let calendarEl = document.querySelector(".trade-calendar .calendar");
		let calendar = new FullCalendar.Calendar(calendarEl, {
			initialView: "dayGridMonth",
			events: events,
			eventDidMount: function (info) {
				// change background of days
				if (info.el.closest(".fc-daygrid-day")) {
					info.el.closest(".fc-daygrid-day").style.backgroundColor = info.event.backgroundColor;
				} // if

				// change fonts of day stats
				if (info.event.title.includes("trades")) {
					info.el.style.fontSize = "1.2rem";
					info.el.style.fontWeight = "normal";
				} // if
			},
			headerToolbar: {
				left: "prev,next today",
				center: "title",
				right: "monthlyProfit",
			},
			customButtons: {
				monthlyProfit: {
					text: "Monthly PnL: $0.00",
				},
			},
			datesSet: function (info) {
				// update total month pnl
				let date = `${info.view.currentStart.getFullYear()}-${String(info.view.currentStart.getMonth() + 1).padStart(2, "0")}`;
				let profit = monthlyProfit[date] || 0;
				document.querySelector(".fc-monthlyProfit-button").innerHTML = `Monthly PnL: $${profit.toFixed(2)}`;
				document.querySelector(".fc-monthlyProfit-button").style.backgroundColor = `${profit > 0 ? "rgb(64, 121, 64)" : profit < 0 ? "rgb(129, 65, 65)" : "#555"}`;

				// update weekly pnl
				updateWeeklyPnL(info.view.currentStart, dailyStats);
			},
		});
		calendar.render();
	} // updatePnLCalendar

	// makes updatePnLCalendar global
	window.updatePnLCalendar = updatePnLCalendar;

	// updates weekly pnl summary
	function updateWeeklyPnL(startDate, dailyStats) {
		// get total profit and trade count for each week
		let weeklyStats = {};

		// get first date in grid
		let currentDate = new Date(startDate);
		currentDate.setDate(currentDate.getDate() - currentDate.getDay());
		for (let i = 1; i < 7; i++) {
			// each week
			if (!weeklyStats[i]) {
				weeklyStats[i] = { profit: 0, tradeCount: 0 };
			} // if

			for (let j = 0; j < 7; j++) {
				// each day
				let date = currentDate.toISOString().split("T")[0];
				if (dailyStats[date]) {
					weeklyStats[i].profit += dailyStats[date].profit;
					weeklyStats[i].tradeCount += dailyStats[date].tradeCount;
				} // if

				currentDate.setDate(currentDate.getDate() + 1);
			} // for
		} // for

		let weekList = document.querySelector(".trade-calendar .week-list");
		weekList.innerHTML = "";

		// create new object for each week
		Object.keys(weeklyStats).forEach((week) => {
			let weekItem = document.createElement("div");
			weekItem.classList.add("week-item");

			weekItem.innerHTML = `
                <h2 class="week-item-title">Week ${week}</h2>
                <h2 class="week-item-profit ${weeklyStats[week].profit > 0 ? "positive" : weeklyStats[week].profit < 0 ? "negative" : ""}">$${weeklyStats[week].profit.toFixed(2)}</h2>
                <h2 class="week-item-trade-count">${weeklyStats[week].tradeCount} trades<h2>
            `;
			weekList.appendChild(weekItem);
		});
	} // updateWeeklyPnL

	// updates trade table from storage
	function updateTrades() {
		tradeTableBody.innerHTML = "";
		for (let i = trades.length - 1; i >= 0; i--) {
			let trade = trades[i];

			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${trade.date}</td>
                <td>${trade.symbol}</td>
                <td ${trade.direction == "long" ? 'class="positive"' : 'class="negative"'}>${trade.direction}</td>
                <td>$${trade.entry.toFixed(2)}</td>
                <td>$${trade.exit.toFixed(2)}</td>
                <td>${trade.contracts}</td>
                <td>$-${trade.fees.toFixed(2)}</td>
                <td ${trade.profit > 0 ? 'class="positive"' : 'class="negative"'}>$${trade.profit.toFixed(2)}</td>
                <td><button onclick="removeTrade(${i})">Remove</button></td>
            `;
			tradeTableBody.appendChild(row);
		} // for

		updateStats();
	} // updateTrades

	// makes updateTrades global
	window.updateTrades = updateTrades;

	// remove trade from storage
	window.removeTrade = (index) => {
		trades.splice(index, 1);
		localStorage.setItem("trades", JSON.stringify(trades));
		updateTrades();
	};

	// initially load all trades
	updateTrades();

	// only show stats tab first
	showTab("stats");
});

// shows the specified tab and hides others
function showTab(tab) {
	// hide all tabs
	document.querySelectorAll("#tab-content").forEach((tab) => {
		(tab.style.position = "absolute"), (tab.style.opacity = "0"), (tab.style.pointerEvents = "none");
	});

	// show specified tab
	document.querySelector(`.${tab}`).style.position = "static";
	document.querySelector(`.${tab}`).style.opacity = "1";
	document.querySelector(`.${tab}`).style.pointerEvents = "all";
} // showTab

// clears all trades
function clearTrades() {
	if (localStorage.getItem("trades")) {
		localStorage.removeItem("trades");
		location.reload();
	} // if
} // clearTrades

// downloads the trades to a csv file
function exportTradesToCSV() {
	let trades = JSON.parse(localStorage.getItem("trades")) || [];

	if (trades.length == 0) {
		alert("No trades available to export.");
		return;
	} // if

	let csv = "data:text/csv;charset=utf-8,";
	let headers = Object.keys(trades[0]).join(",") + "\n";
	csv += headers;

	trades.forEach((trade) => {
		let row = Object.values(trade)
			.map((value) => `${value}`)
			.join(",");
		csv += row + "\n";
	});

	let link = document.createElement("a");
	link.setAttribute("href", encodeURI(csv));
	link.setAttribute("download", "trading_journal.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
} // exportTradeToCSV

// clicks invisible file upload button
function triggerFileUpload() {
	document.getElementById("fileInput").click();
} // triggerFileUpload

// takes the trades from csv and stores in local storage
function importTradesFromCSV() {
	let fileInput = document.getElementById("fileInput");
	let file = fileInput.files[0];

	if (!file) {
		alert("Please select a CSV file.");
		return;
	} // if

	let reader = new FileReader();
	reader.onload = function (event) {
		let csv = event.target.result;
		let lines = csv
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line);

		if (lines.length < 2) {
			alert("Invalid CSV format.");
			return;
		} // if

		let headers = lines[0].split(",");
		let trades = JSON.parse(localStorage.getItem("trades")) || [];

		for (let i = 1; i < lines.length; i++) {
			let values = lines[i].split(",");
			if (values.length == headers.length) {
				let trade = {};
				headers.forEach((header, index) => {
					let value = values[index].replace(/"/g, "");
					trade[header] = isNaN(value) ? value : parseFloat(value);
				});
				trades.push(trade);
			} // if
		} // for

		localStorage.setItem("trades", JSON.stringify(trades));

		updateTrades();
		location.reload();
	};

	reader.readAsText(file);
} // importTradesFromCSV
