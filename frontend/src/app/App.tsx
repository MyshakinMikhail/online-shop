import { ProductsPage, ProfilePage } from "@/pages";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";

export default function App() {
	return (
		<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
			<BrowserRouter>
				<Routes>
					<Route path="/profile" element={<ProfilePage />} />
					<Route element={<MainLayout />}>
						<Route path="/:category" element={<ProductsPage />} />
						<Route path="*" element={<ProductsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
	);
}
