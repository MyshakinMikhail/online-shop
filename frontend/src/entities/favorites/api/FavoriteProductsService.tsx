import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

export const FavoriteProductsService = {
	addFavoriteProduct: async (productId: number) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const response = await api.post(`/favorite/items/${userInfo.id}`, {
			productId: productId,
		});
		return response;
	},
	deleteFavoriteProduct: async (productId: number) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.delete(`/favorite/items/${userInfo.id}`, {
			data: {
				productId: productId,
			},
		});
	},
	deleteAllFavoriteProducts: async () => {
		const userInfo = storage.getUserInfo();
		api.delete(`/favorites/${userInfo.id}`);
	},
};
