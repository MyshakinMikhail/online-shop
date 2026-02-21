import { storage } from "@/entities/user/api";
import { api } from "@/shared/api";
import type { Product } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

type Props = {
	currPage: number;
	limit: number;
	categoryId: number;
};

type ResultType = {
	products: Product[];
	totalPages: number;
};

type RejectValue = {
	status?: number;
	message: string;
	data?: unknown;
};

export const getProductsForPageByCategoryId = createAsyncThunk<
	ResultType,
	Props,
	{ rejectValue: RejectValue }
>(
	"getProduct/ByCategoryId",
	async ({ currPage, limit, categoryId }: Props, { rejectWithValue }) => {
		try {
			const userInfo: YandexUserInfo = storage.getUserInfo();
			const result = await api.get(`/products/${userInfo.id}`, {
				params: {
					page: currPage,
					limit: limit,
					categoryId: categoryId,
				},
			});
			return {
				products: result.data.products,
				totalPages: result.data.count,
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
