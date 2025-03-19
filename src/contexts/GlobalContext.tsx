import { createContext, useContext, useState } from "react";
import { User, Account, Trade } from "../types";

interface GlobalState {
	API_ADDRESS: string;
	user: User;
	setUser: any;
	currentAccount: Account;
	setCurrentAccount: (account: Account) => void;
	trades: Trade[];
	setTrades: any;
}

export const GlobalContext = createContext<GlobalState | null>(null);

export const GlobalProvider = ({ children }: any) => {
	const API_ADDRESS = "http://localhost:5000";
	const [user, setUser] = useState<User>({
		userId: -1,
		username: "",
		accounts: [],
	});
	const [currentAccount, setCurrentAccount] = useState<Account>({
		accountId: -1,
		accountName: "",
		trades: [],
	});
	const [trades, setTrades] = useState<Trade[]>([]);

	return <GlobalContext.Provider value={{ API_ADDRESS, user, setUser, currentAccount, setCurrentAccount, trades, setTrades }}>{children}</GlobalContext.Provider>;
};

export const useGlobalState = () => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalState must be used within a GlobalProvider");
	}
	return context;
};
