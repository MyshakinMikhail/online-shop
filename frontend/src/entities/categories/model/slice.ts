import type { Category } from "@/shared/types";
import { createSlice } from "@reduxjs/toolkit";
import { getCurrentCategory } from "./thunk";

type CategoryType = {
	category: Category | null;
	loading: boolean;
	error: null | string;
};

const initialState: CategoryType = { category: null, loading: false, error: null };

export const categorySlice = createSlice({
	name: "category",
	initialState: initialState,
	reducers: {
		changeCategory: (state, action) => {
			return action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getCurrentCategory.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getCurrentCategory.fulfilled, (state, action) => {
				state.loading = false;
				state.category = action.payload;
			})
			.addCase(getCurrentCategory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const { changeCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
