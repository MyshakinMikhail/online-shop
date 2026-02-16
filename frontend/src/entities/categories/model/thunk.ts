import { api } from "@/shared/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCurrentCategory = createAsyncThunk("category/getByClug", async (slug: string) => {
	const response = await api.get(`/categories/${slug}`);
	return response.data.category;
});
