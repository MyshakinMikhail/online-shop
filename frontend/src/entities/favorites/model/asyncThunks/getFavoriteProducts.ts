import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { Product } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

type ResultType = {
	favorites: Product[];
};

type RejectValue = {
	status?: number;
	message: string;
	data?: unknown;
};

export const getFavoriteProducts = createAsyncThunk<ResultType, void, { rejectValue: RejectValue }>(
	"getFavoriteProduct",
	async (_, { rejectWithValue }) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const result = await api.get(`/products/${userInfo.id}`, {
				params: {
					isFavorites: true,
				},
			});

			return {
				favorites: result.data.products,
			};
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
