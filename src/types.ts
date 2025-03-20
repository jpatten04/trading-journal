export interface User {
    userId: number;
    username: string;
    password: string;
    accounts: Account[];
}

export interface Account {
    accountId: number;
    accountName: string;
    trades: Trade[];
}

export interface Trade {
    tradeId: number;
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