import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectionRouter() {
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const userInfo = storage.getUserInfo();
				// я не придумал, как мне сделать userSlice, поэтому пока что оставим так, но потом надо будет что-то придумать !!!

				if (!userInfo) {
					setIsAuthenticated(false);
					return;
				}

				if (!userInfo?.id) {
					setIsAuthenticated(false);
					storage.removeUser();
					return;
				}

				try {
					// Ищем по psuid, а не по нашему id
					const response = await api.get(`/auth/checkUser/${userInfo.id}`); // userInfo.id = Yandex ID = psuid

					if (response.status === 200) {
						setIsAuthenticated(true);
					} else {
						console.log("Unexpected status:", response.status);
						setIsAuthenticated(false);
					}
				} catch (apiError: unknown) {
					if (isAxiosError(apiError)) {
						console.log("API check error:", apiError.response?.status);

						if (apiError.response?.status === 404) {
							console.log("User not found in database, clearing storage");
							setIsAuthenticated(false);
							storage.removeUser();
							localStorage.removeItem("yandex_access_token");
						}
					} else {
						console.error("Other API error:", apiError);
						setIsAuthenticated(false);
					}
				}
			} catch (error) {
				console.error("Error parsing user info:", error);
				setIsAuthenticated(false);
				storage.removeUser();
			} finally {
				setIsChecking(false);
			}
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
