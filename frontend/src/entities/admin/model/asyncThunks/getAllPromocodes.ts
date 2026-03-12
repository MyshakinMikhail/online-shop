import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { Promocode } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

type Props = {
	searchQuery: string;
};

type ResultType = {
	promocodes: Promocode[];
};

type RejectValue = {
	status?: number;
	message: string;
	data?: unknown;
};

export const getAllPromocodes = createAsyncThunk<ResultType, Props, { rejectValue: RejectValue }>(
	"getAllPromocodes",
	async ({ searchQuery }, { rejectWithValue }) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const result = await api.get(`/promocodes/${userInfo.id}`, { params: { searchQuery } });
			return result.data;
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
				message: "не AxiosError при получении промокодов для Админа",
			});
		}
	}
);
