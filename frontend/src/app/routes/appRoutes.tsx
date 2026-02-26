import {
	AuthPage,
	CheckoutPage,
	EditProductPage,
	ProductPage,
	ProductsPage,
	ProfilePage,
} from "@/pages";
import MainAdminPage from "@/pages/Admin/Main/MainAdminPage";
import { Navigate, type RouteObject } from "react-router-dom";
import { MainLayout } from "../layouts";
import ProtectionAdminRouter from "./ProtectionAdminRouter";
import ProtectionRouter from "./ProtectionRouter";

export const appRoutes: RouteObject[] = [
	{
		path: "/auth",
		element: <AuthPage />,
	},
	{
		path: "/auth/callback",
		element: <AuthPage />,
	},

	{
		element: <ProtectionAdminRouter />,
		children: [
			{
				path: "/admin/main",
				element: <MainAdminPage />,
			},
			{
				path: "/admin/main/edit/product/:id",
				element: <EditProductPage />,
			},
			{
				path: "/admin/*",
				element: <Navigate to="/admin/main" replace />,
			},
		],
	},

	{
		element: <ProtectionRouter />,
		children: [
			{
				path: "/profile",
				element: <ProfilePage />,
			},
			{
				path: "/product/:id",
				element: <ProductPage />,
			},
			{
				path: "/checkout",
				element: <CheckoutPage />,
			},
			{
				element: <MainLayout />,
				children: [
					{
						index: true,
						element: <ProductsPage />,
					},
					{
						path: "/:category",
						element: <ProductsPage />,
					},
					{
						path: "*",
						element: <Navigate to="/" replace />,
					},
				],
			},
		],
	},

	{
		path: "*",
		element: <Navigate to="/auth" replace />,
	},
];
