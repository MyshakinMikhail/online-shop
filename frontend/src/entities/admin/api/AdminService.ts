import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";

export const AdminService = {
	checkAdmin: async () => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const response = await api.get(`/admin/checkAdmin/${userInfo.id}`);
			return response.status === 200 ? true : false;
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.message);
			} else {
				console.error("Неизвестная ошибка при проверке авторизации админа");
			}
			return false;
		}
	},
};
