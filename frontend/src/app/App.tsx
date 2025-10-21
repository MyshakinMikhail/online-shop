import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductsPage } from "../pages";
import { MainLayout } from "./layouts";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/:category" element={<ProductsPage />} />
					<Route path="*" element={<ProductsPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
