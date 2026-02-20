import { userService } from "@/entities/user/api";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectionRouter() {
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const result = await userService.checkAuth();
			setIsAuthenticated(result);
			setIsChecking(false);
		};

		checkAuth();
	}, []);

	if (isChecking) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
}
