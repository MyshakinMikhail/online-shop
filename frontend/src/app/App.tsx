import { useRoutes } from "react-router-dom";
import { AppProvider } from "./providers";
import { appRoutes } from "./routes";
import "./styles/index.css";

function AppRoutes() {
	return useRoutes(appRoutes);
}

export default function App() {
	return (
		<AppProvider>
			<AppRoutes />
		</AppProvider>
	);
}
