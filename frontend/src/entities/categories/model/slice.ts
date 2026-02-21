import type { Category } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCurrentCategory } from "./asyncThunks";

// вот это хорошо, так и надо в других слайсах инитить !!!
// создать один инит для всего приложения в App.tsx и тогда пропадут
// какие-то useEffects

type CategoryStateType = {
	category: Category | null;
	loading: boolean;
	error: null | string;
};

const initialState: CategoryStateType = {
	category: { id: 1, name: "Все товары", slug: "all" },
	loading: false,
	error: null,
};

export const categorySlice = createSlice({
	name: "category",
	initialState: initialState,
	reducers: {
		changeCategory: (state, action: PayloadAction<Category>) => {
			if (action.payload) {
				state.category = action.payload;
			}
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
