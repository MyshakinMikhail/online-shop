import { api } from "@/shared/api";
import { exchangeCodeForToken, getUserInfo } from "@/shared/lib";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";
import { storage } from "./storage";

export type AuthCallbackType = {
	isSuccess: boolean;
	error?: string;
};

export const userService = {
	handleAuthCallback: async (code: string): Promise<AuthCallbackType> => {
		try {
			const tokenData = await exchangeCodeForToken(code);
			const userInfo: YandexUserInfo = await getUserInfo(tokenData.access_token);

			localStorage.setItem("yandex_access_token", tokenData.access_token);
			if (tokenData.refresh_token) {
				localStorage.setItem("yandex_refresh_token", tokenData.refresh_token);
			}
			storage.setUser(userInfo);

			const response = await api.post("/auth/yandex", {
				user: {
					role: "user",
					psuid: userInfo.id,
					first_name: userInfo.first_name,
					last_name: userInfo.last_name,
					sex: userInfo.sex,
					default_email: userInfo.default_email,
					is_buying_smth: false,
				},
			});

			if (response.status === 200 || response.status === 201) {
				return { isSuccess: true };
			} else {
				throw new Error(`Unexpected status: ${response.status}`);
			}
		} catch (err) {
			console.error("Auth error:", err);
			const errorMessage = "Произошла ошибка при авторизации";
			storage.removeUser();
			localStorage.removeItem("yandex_access_token");
			return { isSuccess: false, error: errorMessage };
		}
	},

	checkAuth: async () => {
		try {
			const userInfo = storage.getUserInfo();
			// я не придумал, как мне сделать userSlice, поэтому пока что оставим так, но потом надо будет что-то придумать !!!

			if (!userInfo) {
				return false;
			}

			if (!userInfo?.id) {
				storage.removeUser();
				return false;
			}

			try {
				// Ищем по psuid, а не по нашему id
				const response = await api.get(`/auth/checkUser/${userInfo.id}`); // userInfo.id = Yandex ID = psuid из бд

				if (response.status === 200) {
					return true;
				} else {
					console.log("Unexpected status:", response.status);
					return false;
				}
			} catch (apiError: unknown) {
				if (isAxiosError(apiError)) {
					console.log("API check error:", apiError.response?.status);

					if (apiError.response?.status === 404) {
						console.log("User not found in database, clearing storage");
						storage.removeUser();
						localStorage.removeItem("yandex_access_token");
					}
				} else {
					console.error("Other API error:", apiError);
				}
				return false;
			}
		} catch (error) {
			console.error("Error parsing user info:", error);
			storage.removeUser();
			return false;
		}
	},
};
