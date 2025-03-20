import { createContext, useContext, useEffect, useState } from "react";
import { User, Account, Trade } from "../types";

interface GlobalState {
	API_ADDRESS: string;
	isUserManage: any;
	setIsUserManage: any;
	user: User | null;
	setUser: any;
	currentAccount: Account | null;
	setCurrentAccount: any;
	isCreatingAccount: any;
	setIsCreatingAccount: any;
	trades: Trade[];
	setTrades: any;
}

export const GlobalContext = createContext<GlobalState | null>(null);

export const GlobalProvider = ({ children }: any) => {
	const API_ADDRESS = "http://localhost:5000";
	const [isUserManage, setIsUserManage] = useState({ isRegistering: false, isSigningIn: false });
	const [user, setUser] = useState(null);
	const [currentAccount, setCurrentAccount] = useState(null);
	const [isCreatingAccount, setIsCreatingAccount] = useState(false);
	const [trades, setTrades] = useState([]);

	// load sessions storage on app load
	useEffect(() => {
		const storedUser = sessionStorage.getItem("user");
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			setUser(() => {
				const storedAcc = sessionStorage.getItem("currentAccount");
				setCurrentAccount(storedAcc ? JSON.parse(storedAcc) : parsedUser.accounts[0] || null);
				return parsedUser;
			});
		}
	}, []);

	return (
		<GlobalContext.Provider value={{ API_ADDRESS, isUserManage, setIsUserManage, user, setUser, currentAccount, setCurrentAccount, isCreatingAccount, setIsCreatingAccount, trades, setTrades }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalState = () => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalState must be used within a GlobalProvider");
	}
	return context;
};
