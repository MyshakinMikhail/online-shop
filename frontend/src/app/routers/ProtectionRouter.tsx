import { Navigate, Outlet } from "react-router-dom";

export default function ProtectionRouter() {
	if (!localStorage.getItem("user_info")) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
}
