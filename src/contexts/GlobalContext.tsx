import { createContext, useContext, useState } from "react";
import { User, Account, Trade } from "../types";

interface GlobalState {
	API_ADDRESS: string;
	isUserManage: any;
	setIsUserManage: any;
	user: User | null;
	setUser: any;
	currentAccount: Account | null;
	setCurrentAccount: any;
	trades: Trade[] | null;
	setTrades: any;
}

export const GlobalContext = createContext<GlobalState | null>(null);

export const GlobalProvider = ({ children }: any) => {
	const API_ADDRESS = "http://localhost:5000";
	const [isUserManage, setIsUserManage] = useState({ isRegistering: false, isSigningIn: false });
	const [user, setUser] = useState(null);
	const [currentAccount, setCurrentAccount] = useState(null);
	const [trades, setTrades] = useState(null);

	return <GlobalContext.Provider value={{ API_ADDRESS, isUserManage, setIsUserManage, user, setUser, currentAccount, setCurrentAccount, trades, setTrades }}>{children}</GlobalContext.Provider>;
};

export const useGlobalState = () => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalState must be used within a GlobalProvider");
	}
	return context;
};
