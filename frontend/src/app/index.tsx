import { createRoot } from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./providers";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
	<StoreProvider>
		<App />
	</StoreProvider>
);
