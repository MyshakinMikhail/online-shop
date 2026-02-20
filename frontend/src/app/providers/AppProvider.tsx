import { ConfigProvider, theme } from "antd";
import { type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./SearchProvider";
import { StoreProvider } from "./StoreProvider";

type Props = {
	children: ReactNode;
};

export function AppProvider({ children }: Props) {
	return (
		<StoreProvider>
			<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
				<SearchProvider>
					<BrowserRouter>{children}</BrowserRouter>
				</SearchProvider>
			</ConfigProvider>
		</StoreProvider>
	);
}
