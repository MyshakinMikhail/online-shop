import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

export const CartServise = {
	addProduct: async (productId: number) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.post(`/cart/items/${userInfo.id}`, { productId });
	},

	updateQuantity: async (productId: number, isIncrement: boolean) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.put(`/cart/items/${userInfo.id}`, {
			productId: productId,
			isIncrement: isIncrement,
		});
	},

	deleteProduct: async (productId: number) => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.delete(`/cart/items/${userInfo.id}`, { data: { productId: productId } });
	},

	deleteCart: async () => {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		await api.delete(`/cart/${userInfo.id}`);
	},
};
