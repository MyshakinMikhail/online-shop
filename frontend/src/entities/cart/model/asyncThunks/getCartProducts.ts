import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { CartItemType, Product } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

type Returned = {
	items: Product[];
	totalSum: number;
};

type RejectValue = {
	status?: number;
	message: string;
	data?: unknown;
};

export const getCartProducts = createAsyncThunk<Returned, void, { rejectValue: RejectValue }>(
	"init/cart",
	async (_, { rejectWithValue }) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const response = await api.get(`/cart/${userInfo.id}`);
			const items = response.data.cart.items.map((item: CartItemType) => ({
				...item.product,
				quantity: item.quantity,
			}));

			const totalSum = response.data.cart.items.reduce(
				(acc: number, item: CartItemType) =>
					acc + (item?.quantity ?? 0) * (item.product?.price ?? 0),
				0
			);

			return { items, totalSum };
		} catch (error) {
			if (isAxiosError(error)) {
				console.log(error);
				return rejectWithValue({
					status: error.response?.status,
					message: error.message,
					data: error.response?.data,
				});
			}
			return rejectWithValue({
				message: "не AxiosError при получении продуктов для страницы по категории",
			});
		}
	}
);
