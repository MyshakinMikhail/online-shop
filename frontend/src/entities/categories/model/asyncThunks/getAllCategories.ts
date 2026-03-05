import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { CategoriesServise } from "../../api/CategoiesService";

export const getAllCategories = createAsyncThunk(
	"categories/getAllCategories",
	async (_, { rejectWithValue }) => {
		try {
			return await CategoriesServise.getCategories();
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
