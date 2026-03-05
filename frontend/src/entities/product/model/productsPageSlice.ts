import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getCurrProductsByCategoryId } from "./asyncThunks";

type CurrProductsState = {
	items: Product[];
	totalPages: number;
	currPage: number;
	limit: number;
	isLoading: boolean;
	error: string | null;
};

type ProductsStateType = {
	currProducts: CurrProductsState;
};

const initialState: ProductsStateType = {
	currProducts: {
		items: [],
		totalPages: 0,
		currPage: 1,
		limit: 16,
		isLoading: false,
		error: null,
	},
	// делать запрос на серв поиска продуктов и загрузки избранных ( тут еще будет локальный стейт для отображения )
};

// разделить на два слайса
// не бояться делать запросы на бэк ( для глобального поиска я написал подробности в ручке получения продуктов)

const currProductsSlice = createSlice({
	name: "productsPage",
	initialState,
	reducers: {
		updateCurrPage: (state, action: PayloadAction<number>) => {
			if (action.payload) {
				state.currProducts.currPage = action.payload;
			}
		},
		addFavoriteItem: (state, action: PayloadAction<number>) => {
			if (action.payload) {
				state.currProducts.items = state.currProducts.items.map((product: Product) =>
					product.id === action.payload ? { ...product, isFavorite: true } : product
				);
			}
		},
		deleteFavoriteItem: (state, action: PayloadAction<number>) => {
			if (action.payload) {
				state.currProducts.items = state.currProducts.items.map((product: Product) =>
					product.id === action.payload ? { ...product, isFavorite: false } : product
				);
			}
		},
		deleteAllFavoriteItems: state => {
			state.currProducts.items = state.currProducts.items.map((product: Product) => ({
				...product,
				isFavorite: false,
			}));
		},
		setLimit: (state, action: PayloadAction<{ limit: number }>) => {
			state.currProducts.limit = action.payload.limit;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getCurrProductsByCategoryId.pending, state => {
				state.currProducts.isLoading = true;
				state.currProducts.error = null;
			})
			.addCase(getCurrProductsByCategoryId.fulfilled, (state, action) => {
				state.currProducts.isLoading = false;
				state.currProducts.items = action.payload.products;
				state.currProducts.totalPages = action.payload.totalPages;
			})
			.addCase(getCurrProductsByCategoryId.rejected, (state, action) => {
				state.currProducts.isLoading = false;
				state.currProducts.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const {
	updateCurrPage,
	addFavoriteItem,
	deleteFavoriteItem,
	deleteAllFavoriteItems,
	setLimit,
} = currProductsSlice.actions;
export const productsPageReducer = currProductsSlice.reducer;
