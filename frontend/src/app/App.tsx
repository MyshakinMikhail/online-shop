import {
	AuthAdminPage,
	AuthPage,
	ProductPage,
	ProductsPage,
	ProfilePage,
} from "@/pages";
import MainAdminPage from "@/pages/Admin/Main/MainAdminPage";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import { SearchProvider } from "./providers";
import { ProtectionRouter } from "./routers";
import "./styles/index.css";

export default function App() {
	return (
		<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
			<SearchProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/auth/callback" element={<AuthPage />} />

						<Route path="/admin/auth" element={<AuthAdminPage />} />
						<Route path="/admin/main" element={<MainAdminPage />} />

						<Route element={<ProtectionRouter />}>
							<Route path="/profile" element={<ProfilePage />} />
							<Route
								path="/products/:id"
								element={<ProductPage />}
							/>
							<Route element={<MainLayout />}>
								<Route
									path="/:category"
									element={<ProductsPage />}
								/>
								<Route path="*" element={<ProductsPage />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</SearchProvider>
		</ConfigProvider>
	);
}
