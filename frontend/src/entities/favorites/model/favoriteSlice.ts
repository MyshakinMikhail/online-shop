import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getFavoriteProducts } from "./asyncThunks";

type FavoritesState = {
	favorites: Product[];
	isLoading: boolean;
	error: string | null;
};

const initialState: FavoritesState = { favorites: [], isLoading: false, error: null };

const favoriteSlice = createSlice({
	name: "favorites",
	initialState: initialState,
	reducers: {
		updateFavorites: (state, action: PayloadAction<{ product: Product }>) => {
			const findedProduct = state.favorites.find(
				product => product.id === action.payload.product.id
			);

			if (findedProduct) {
				state.favorites = state.favorites.filter(
					product => product.id !== action.payload.product.id
				);
			} else {
				state.favorites.push(action.payload.product);
			}
		},
		deleteAllFavorites: state => {
			state.favorites = [];
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getFavoriteProducts.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getFavoriteProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.favorites = action.payload.favorites;
			})
			.addCase(getFavoriteProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const { updateFavorites, deleteAllFavorites } = favoriteSlice.actions;
export const favoriteProductsReducer = favoriteSlice.reducer;
