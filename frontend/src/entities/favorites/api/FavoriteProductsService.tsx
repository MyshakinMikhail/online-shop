import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { isAxiosError } from "axios";

export const FavoriteProductsService = {
	addFavoriteProduct: async (productId: number) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const response = await api.post(`/favorite/items/${userInfo.id}`, {
				productId: productId,
			});
			return response;
		} catch (error) {
			console.log(error);
			if (isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		}
	},
	deleteFavoriteProduct: async (productId: number) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			await api.delete(`/favorite/items/${userInfo.id}`, {
				data: {
					productId: productId,
				},
			});
		} catch (error) {
			console.log(error);
			if (isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		}
	},
	deleteAllFavoriteProducts: async () => {
		try {
			const userInfo = storage.getUserInfo();
			api.delete(`/favorites/${userInfo.id}`);
		} catch (error) {
			console.log(error);
			if (isAxiosError(error)) {
				console.log(error.response?.data.message);
			}
		}
	},
};
