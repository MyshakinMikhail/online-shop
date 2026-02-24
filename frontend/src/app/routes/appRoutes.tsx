import {
	AuthAdminPage,
	AuthPage,
	CheckoutPage,
	EditProductPage,
	ProductPage,
	ProductsPage,
	ProfilePage,
} from "@/pages";
import MainAdminPage from "@/pages/Admin/Main/MainAdminPage";
import { type RouteObject } from "react-router-dom";
import { MainLayout } from "../layouts";
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
		path: "/admin/auth",
		element: <AuthAdminPage />,
	},
	{
		path: "/admin/main",
		element: <MainAdminPage />,
	},
	{
		path: "/admin/main/edit/product/:id",
		element: <EditProductPage />,
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
						path: "/:category",
						element: <ProductsPage />,
					},
					{
						path: "*",
						element: <ProductsPage />,
					},
				],
			},
		],
	},
];
