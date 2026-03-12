import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

export const AdminService = {
	checkAdmin: async () => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const response = await api.get(`/admin/checkAdmin/${userInfo.id}`);
		return response.status === 200 ? true : false;
	},
};
