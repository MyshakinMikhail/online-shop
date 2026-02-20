// import { api } from "@/shared/api";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// export const getCurrentCategory = createAsyncThunk("category/getByClug", async (slug: string) => {
// 	const response = await api.get(`/categories/${slug}`);
// 	return response.data.category;
// });

import { api } from "@/shared/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

export const getCurrentCategory = createAsyncThunk(
	"category/getByClug",
	async (slug: string, { rejectWithValue }) => {
		try {
			if (!slug) {
				return rejectWithValue({ message: "slug must be a string" });
			}
			const response = await api.get(`/categories/${slug}`);
			return response.data.category;
		} catch (error) {
			console.log("Ошибка получения категории по slug");
			if (isAxiosError(error)) {
				const serverResponse =
					error.response?.data?.message ||
					error.response?.data?.error ||
					"Неизвестная ошибка";
				return rejectWithValue({
					message: serverResponse,
					status: error.status,
					data: error.response?.data,
				});
			}
			return rejectWithValue({ message: "Ошибка сети или неизвестная ошибка" });
		}
	}
);
