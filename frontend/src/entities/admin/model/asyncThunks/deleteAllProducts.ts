import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

const userInfo: YandexUserInfo = storage.getUserInfo();

type ResultType = {
	status: number;
	message: string;
	isSuccess: boolean;
};

type RejectValue = {
	status?: number;
	message: string;
	isSuccess: boolean;
};

export const deleteAllProducts = createAsyncThunk<ResultType, void, { rejectValue: RejectValue }>(
	"deleteAllProducts",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.delete(`/products/${userInfo.id}`);
			return {
				message: response.data.message,
				status: response.status,
				isSuccess: response.status === 200 ? true : false,
			};
		} catch (error) {
			if (isAxiosError(error)) {
				return rejectWithValue({
					status: error.response?.status,
					message: error.response?.data.message,
					isSuccess: false,
				});
			}
			return rejectWithValue({
				status: 500,
				message: "Неизвестная ошибка при удалении всех продуктов",
				isSuccess: false,
			});
		}
	}
);
