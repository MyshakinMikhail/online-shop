import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getAllProducts } from "./getAllProducts";

type ProductsState = {
	items: Product[];
	isLoading: boolean;
	error: string | null;
};

type ProductsStateType = {
	productsForPage: ProductsState;
	allProducts: ProductsState;
};

const initialState: ProductsStateType = {
	productsForPage: { items: [], isLoading: false, error: null },
	allProducts: { items: [], isLoading: false, error: null },
};
// { products: Product[] } - нельзя в state использовать [] для initialState !!!
// делать refetch для обновления продуктов

const productsPageSlice = createSlice({
	name: "productsPage",
	initialState,
	reducers: {
		updateProductsForPage: (state, action: PayloadAction<Product[]>) => {
			if (action.payload) {
				state.productsForPage.items.length = 0;
				state.productsForPage.items.push(...action.payload);
			}
		}, // вызывается после useEffect
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
				console.log("Продукты должны добавиться: ", action.payload);
			})
			.addCase(getAllProducts.rejected, (state, action) => {
				state.allProducts.isLoading = false;
				state.allProducts.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const {
	updateProductsForPage,
	addFavoriteItem,
	deleteFavoriteItem,
	deleteAllFavoriteItems,
} = productsPageSlice.actions;
export const productsPageReducer = productsPageSlice.reducer;
