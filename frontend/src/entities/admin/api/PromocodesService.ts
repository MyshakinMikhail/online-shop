import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";

const userInfo: YandexUserInfo = storage.getUserInfo();

export const PromocodesService = {
	getAllPromocodes: async (content: string) => {
		try {
			const response = await api.get(`/promocodes/${userInfo.id}`, {
				params: {
					searchQuery: content,
				},
			});
			return response.data.promocodes;
		} catch (error) {
			if (isAxiosError(error)) {
				throw new Error(error.message);
			} else {
				throw new Error(`Неизвестная ошибка при получении промокодов: ${error}`);
			}
		}
	},

	deleteAllPromocodes: async () => {
		try {
			await api.delete(`/promocodes/${userInfo.id}`, {});
		} catch (error) {
			if (isAxiosError(error)) {
				throw new Error(error.message);
			} else {
				throw new Error(`Неизвестная ошибка при получении промокодов: ${error}`);
			}
		}
	},
};
