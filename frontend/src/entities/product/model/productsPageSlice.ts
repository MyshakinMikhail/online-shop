import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAllProducts, getProductsForPageByCategoryId } from "./asyncThunks";

type ProductsForPageState = {
	items: Product[];
	totalPages: number;
	currPage: number;
	isLoading: boolean;
	error: string | null;
};

type AllProductsState = {
	items: Product[];
	isLoading: boolean;
	error: string | null;
};

type ProductsStateType = {
	productsForPage: ProductsForPageState;
	allProducts: AllProductsState;
};

const initialState: ProductsStateType = {
	productsForPage: { items: [], totalPages: 0, currPage: 1, isLoading: false, error: null },
	allProducts: { items: [], isLoading: false, error: null }, // это не надо
	// делать запрос на серв поиска продуктов и загрузки избранных ( тут еще будет локальный стейт для отображения )
};

// разделить на два слайса
// не бояться делать запросы на бэк ( для глобального поиска я написал подробности в ручке получения продуктов)

const productsPageSlice = createSlice({
	name: "productsPage",
	initialState,
	reducers: {
		updateCurrPage: (state, action: PayloadAction<number>) => {
			if (action.payload) {
				state.productsForPage.currPage = action.payload;
			}
		},
		addFavoriteItem: (state, action: PayloadAction<number>) => {
			if (action.payload) {
				state.productsForPage.items = state.productsForPage.items.map((product: Product) =>
					product.id === action.payload ? { ...product, isFavorite: true } : product
				);
				state.allProducts.items = state.allProducts.items.map((product: Product) =>
					product.id === action.payload ? { ...product, isFavorite: true } : product
				);
			}
		},
		deleteFavoriteItem: (state, action: PayloadAction<number>) => {
			if (action.payload) {
				state.productsForPage.items = state.productsForPage.items.map((product: Product) =>
					product.id === action.payload ? { ...product, isFavorite: false } : product
				);
				state.allProducts.items = state.allProducts.items.map((product: Product) =>
					product.id === action.payload ? { ...product, isFavorite: false } : product
				);
			}
		},
		deleteAllFavoriteItems: state => {
			state.productsForPage.items = state.productsForPage.items.map((product: Product) => ({
				...product,
				isFavorite: false,
			}));
			state.allProducts.items = state.allProducts.items.map((product: Product) => ({
				...product,
				isFavorite: false,
			}));
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getAllProducts.pending, state => {
				state.allProducts.isLoading = true;
				state.allProducts.error = null;
			})
			.addCase(getAllProducts.fulfilled, (state, action) => {
				state.allProducts.isLoading = false;
				state.allProducts.items = action.payload;
			})
			.addCase(getAllProducts.rejected, (state, action) => {
				state.allProducts.isLoading = false;
				state.allProducts.error = action.error.message || "Неизвестная ошибка";
			})
			.addCase(getProductsForPageByCategoryId.pending, state => {
				state.productsForPage.isLoading = true;
				state.productsForPage.error = null;
			})
			.addCase(getProductsForPageByCategoryId.fulfilled, (state, action) => {
				state.productsForPage.isLoading = false;
				state.productsForPage.items = action.payload.products;
				state.productsForPage.totalPages = action.payload.totalPages;
			})
			.addCase(getProductsForPageByCategoryId.rejected, (state, action) => {
				state.productsForPage.isLoading = false;
				state.productsForPage.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const { updateCurrPage, addFavoriteItem, deleteFavoriteItem, deleteAllFavoriteItems } =
	productsPageSlice.actions;
export const productsPageReducer = productsPageSlice.reducer;
