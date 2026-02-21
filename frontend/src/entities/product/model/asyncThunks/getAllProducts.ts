import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

export const getAllProducts = createAsyncThunk("all/products", async (_, { rejectWithValue }) => {
	try {
		const userInfo: YandexUserInfo = storage.getUserInfo();

		const response = await api.get(`/products/${userInfo.id}`, {
			params: {
				page: 0,
				limit: 10000,
				categoryId: 1,
			},
		});
		return response.data.products;
	} catch (error) {
		if (isAxiosError(error)) {
			console.error(error);
			return rejectWithValue({
				status: error.status,
				message: error.message,
				data: error.response?.data,
			});
		}
	}
});
