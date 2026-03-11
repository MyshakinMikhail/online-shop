import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";

export const ProductsService = {
	getProducts: async (searchQuery: string) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const response = await api.get(`/products/${userInfo.id}`, {
				params: {
					searchQuery: searchQuery,
				},
			});
			return response.data.products;
		} catch (error) {
			if (isAxiosError(error)) {
				throw new Error(error.message);
			}
			throw new Error("Неизвестная ошибка при получении продуктов с сервера");
		}
	},
	deleteProducts: async () => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const response = await api.delete(`/products/${userInfo.id}`);
			return response.data.message;
		} catch (error) {
			if (isAxiosError(error)) {
				throw new Error(error.message);
			}
		}
	},
};
