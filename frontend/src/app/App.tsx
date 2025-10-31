import { ProductsPage, ProfilePage } from "@/pages";
import ProductPage from "@/pages/Product/ProductPage";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import "./styles/index.css";

export default function App() {
	return (
		<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
			<BrowserRouter>
				<Routes>
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/products/:id" element={<ProductPage />} />
					<Route element={<MainLayout />}>
						<Route path="/:category" element={<ProductsPage />} />
						<Route path="*" element={<ProductsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
	);
}
