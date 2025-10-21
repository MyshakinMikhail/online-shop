// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductsPage } from "../pages";
import { MainLayout } from "./layouts/MainLayout";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/" element={<ProductsPage />} />
					<Route path="/:category" element={<ProductsPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
