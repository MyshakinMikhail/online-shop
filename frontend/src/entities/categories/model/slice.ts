import type { Category } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCurrentCategory } from "./asyncThunks";

type CategoryStateType = {
	allCategories: Category[];
	category: Category | null;
	loading: boolean;
	error: null | string;
};

const initialState: CategoryStateType = {
	allCategories: [],
	category: { id: 1, name: "Все товары", slug: "all" },
	loading: false,
	error: null,
};

export const categorySlice = createSlice({
	name: "category",
	initialState: initialState,
	reducers: {
		setAllCategories: (state, action) => {
			if (action.payload) {
				state.allCategories = action.payload.allCategories;
			}
		},
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
			.addCase(
				getCurrentCategory.fulfilled,
				(
					state,
					action: PayloadAction<{ allCategories: Category[]; currCategory: Category }>
				) => {
					state.loading = false;
					state.category = action.payload.currCategory;
					state.allCategories = action.payload.allCategories;
				}
			)
			.addCase(getCurrentCategory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const { setAllCategories, changeCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
