import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

const STORAGE_KEY = "user_info";

export const storage = {
	getUserInfo: (key: string = STORAGE_KEY) => {
		try {
			const info = localStorage.getItem(key);
			return info ? JSON.parse(info) : null;
		} catch (error) {
			console.error("Ошибка парсинга данных из localStorage:", error);
			return null;
		}
	},
	setUser: (userInfo: YandexUserInfo, key: string = STORAGE_KEY) => {
		try {
			localStorage.setItem(key, JSON.stringify(userInfo));
		} catch (error) {
			console.error("Ошибка обноваления данных в localStorage:", error);
			return null;
		}
	},
	removeUser: (key: string = STORAGE_KEY) => {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error("Ошибка удаления данных из localStorage:", error);
			return null;
		}
	},
};
