import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { CreationProductType, Product } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";

const userInfo: YandexUserInfo = storage.getUserInfo();

export const ProductService = {
	postProduct: async ({ product }: { product: CreationProductType }) => {
		const response = await api.post(`/product/${userInfo.id}`, {
			product: {
				...product,
			},
		});
		return response.data.createdProduct;
	},
	updateProduct: async ({ product }: { product: Product }) => {
		const response = await api.put(`/product/${userInfo.id}`, {
			product,
		});

		return response.data.updatedProduct;
	},
	deleteProduct: async (productId: number) => {
		const response = await api.delete(`/product/${userInfo.id}/${productId}`);
		return response.status;
	},
};
