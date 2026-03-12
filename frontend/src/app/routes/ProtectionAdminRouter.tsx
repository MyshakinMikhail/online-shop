import { AdminService } from "@/entities/admin/api/AdminService";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectionAdminRouter() {
	const [isChecking, setIsChecking] = useState(true);
	const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const result = await AdminService.checkAdmin();
				setIsAdminAuthenticated(result);
			} catch (error) {
				if (isAxiosError(error)) {
					console.error(error.response?.data.message);
				} else {
					console.error("Неизвестная ошибка при проверке авторизации админа");
				}
				return false;
			} finally {
				setIsChecking(false);
			}
		};
		checkAuth();
	}, []);

	if (isChecking) return <div>Loading...</div>;

	if (!isAdminAuthenticated) return <Navigate to="/" replace />;

	return <Outlet />;
}
