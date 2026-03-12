import type { Category } from "@/shared/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { CategoriesServise } from "../../api/CategoiesService";

type RejectValue = {
	status?: number;
	message: string;
	data?: unknown;
};

export const getAllCategories = createAsyncThunk<Category[], void, { rejectValue: RejectValue }>(
	"categories/getAllCategories",
	async (_, { rejectWithValue }) => {
		try {
			const categories = await CategoriesServise.getCategories();
			return categories;
		} catch (error) {
			if (isAxiosError(error)) {
				return rejectWithValue({
					message: error.response?.data.message,
					status: error.response?.status,
					data: error.response?.data,
				});
			}
			return rejectWithValue({ message: "Неизвестная ошибка при получении категорий" });
		}
	}
);
