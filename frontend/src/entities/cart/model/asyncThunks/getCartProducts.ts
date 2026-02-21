import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { CartItemType } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCartProducts = createAsyncThunk("init/cart", async () => {
	try {
		const userInfo: YandexUserInfo = storage.getUserInfo();
		const response = await api.get(`/cart/${userInfo.id}`);
		const items = response.data.cart.items.map((item: CartItemType) => ({
			...item.product,
			quantity: item.quantity,
		}));

		return items;
	} catch (e) {
		console.log(e);
	}
});
