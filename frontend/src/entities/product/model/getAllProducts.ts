import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllProducts = createAsyncThunk("all/products", async () => {
	const userInfo: YandexUserInfo = storage.getUserInfo();

	console.log(1);
	const response = await api.get(`/products/${userInfo.id}`, {
		params: {
			page: 0,
			limit: 10000,
			categoryId: 1,
		},
	});
	console.log(2);
	return response.data.products;
});
