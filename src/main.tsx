import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "./contexts/GlobalContext.tsx";
import App from "./App.tsx";
import "./global.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GlobalProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</GlobalProvider>
	</StrictMode>
);
