import { api } from "@/shared/api";
import type { Category } from "@/shared/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

type RejectValue = {
	status?: number;
	message: string;
	data?: string;
};

type Returned = {
	allCategories: Category[];
	currCategory: Category;
};

export const getCurrentCategory = createAsyncThunk<Returned, void, { rejectValue: RejectValue }>(
	"category/getByClug",
	async (_, { rejectWithValue }) => {
		try {
			const slug = window.location.pathname.split("/").pop() || "all";
			if (!slug) {
				return rejectWithValue({ message: "slug не передан" });
			}
			const currCategoryResponse = await api.get(`/categories/${slug}`);
			const allCategoriesResponse = await api.get("/categories/");
			return {
				allCategories: allCategoriesResponse.data.categories,
				currCategory: currCategoryResponse.data.category,
			};
		} catch (error) {
			if (isAxiosError(error)) {
				return rejectWithValue({
					message: error.response?.data.message,
					status: error.response?.status,
					data: error.response?.data,
				});
			}
			return rejectWithValue({
				message: "Неизвестная ошибка при получении текущей категории",
			});
		}
	}
);
