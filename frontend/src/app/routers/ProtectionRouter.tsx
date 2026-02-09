import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectionRouter() {
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// 1. Проверяем localStorage
				const storedData = localStorage.getItem("user_info");

				if (!storedData) {
					setIsAuthenticated(false);
					return;
				}

				// 2. Парсим данные
				const userInfo: YandexUserInfo = JSON.parse(storedData);

				if (!userInfo?.id) {
					// Нет Yandex ID
					setIsAuthenticated(false);
					localStorage.removeItem("user_info");
					return;
				}

				// 3. Проверяем пользователя в БД по psuid (Yandex ID)
				try {
					// Ищем по psuid, а не по нашему id
					const response = await api.get(`/checkUser/${userInfo.id}`); // userInfo.id = Yandex ID = psuid

					if (response.status === 200) {
						// Пользователь найден
						setIsAuthenticated(true);
					} else {
						// Неожиданный статус
						console.log("Unexpected status:", response.status);
						setIsAuthenticated(false);
					}
				} catch (apiError: any) {
					console.log("API check error:", apiError.response?.status);

					if (apiError.response?.status === 404) {
						// Пользователь не найден в БД
						console.log("User not found in database, clearing storage");
						setIsAuthenticated(false);
						localStorage.removeItem("user_info");
						localStorage.removeItem("yandex_access_token");
					} else {
						// Другие ошибки
						console.error("Other API error:", apiError);
						setIsAuthenticated(false);
					}
				}
			} catch (error) {
				// Ошибка парсинга JSON
				console.error("Error parsing user info:", error);
				setIsAuthenticated(false);
				localStorage.removeItem("user_info");
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
