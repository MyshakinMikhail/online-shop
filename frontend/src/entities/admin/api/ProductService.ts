import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { CreationProductType, Product } from "@/shared/types";
import { isAxiosError } from "axios";

const userInfo = storage.getUserInfo();

export const ProductService = {
	postProduct: async ({ product }: { product: CreationProductType }) => {
		try {
			const response = await api.post(`/product/${userInfo.id}`, {
				product: {
					...product,
				},
			});
			return response.data.createdProduct;
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.message);
			} else {
				console.error("Неизвестная ошибка при добавлении продукта на сервер");
			}
			return;
		}
	},
	updateProduct: async ({ product }: { product: Product }) => {
		try {
			const response = await api.put(`/product/${userInfo.id}`, {
				product,
			});

			return response.data.updatedProduct;
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.message);
			} else {
				console.error("Неизвестная ошибка при обновлении продукта на сервере");
			}
			return;
		}
	},
	deleteProduct: async (productId: number) => {
		try {
			const response = await api.delete(`/product/${userInfo.id}/${productId}`);

			return response.status;
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.message);
			} else {
				console.error("Неизвестная ошибка при удалении продукта на сервере");
			}
			return;
		}
	},
};
