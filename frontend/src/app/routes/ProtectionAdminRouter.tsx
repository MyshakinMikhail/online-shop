import { AdminService } from "@/entities/admin/api/AdminService";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectionAdminRouter() {
	const [isChecking, setIsChecking] = useState(true);
	const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const result = await AdminService.checkAdmin();
			setIsAdminAuthenticated(result);
			setIsChecking(false);
		};
		checkAuth();
	}, []);

	if (isChecking) return <div>Loading...</div>;

	if (!isAdminAuthenticated) return <Navigate to="/" replace />;

	return <Outlet />;
}
