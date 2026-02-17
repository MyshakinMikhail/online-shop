import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

export const CartServise = {
	addProduct: async (productId: number) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			await api.post(`/cart/items/${userInfo.id}`, { productId });
		} catch (error) {
			console.error("Ошибка добавления продукта на сервере: ", error);
		}
	},

	updateQuantity: async (productId: number, isIncrement: boolean) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			await api.put(`/cart/items/${userInfo.id}`, {
				productId: productId,
				isIncrement: isIncrement,
			});
		} catch (error) {
			console.error("Ошибка обновления количества продукта на сервере: ", error);
		}
	},

	deleteProduct: async (productId: number) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			await api.delete(`/cart/items/${userInfo.id}`, { data: { productId: productId } });
		} catch (error) {
			console.error("Ошибка удаления продукта на сервере: ", error);
		}
	},

	deleteCart: async () => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			await api.delete(`/cart/${userInfo.id}`);
		} catch (error) {
			console.error("Ошибка удаления корзины на сервере: ", error);
		}
	},
};
