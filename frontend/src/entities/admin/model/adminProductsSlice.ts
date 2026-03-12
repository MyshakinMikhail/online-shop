import type { CreationProductType, Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteAllProducts, getAllProducts } from "./asyncThunks";

type InitialStateType = {
	products: Product[];
	isLoading: boolean;
	error: string | null;
};

const initialState: InitialStateType = { products: [], isLoading: false, error: null };

const adminProductsSlice = createSlice({
	name: "adminProducts",
	initialState,
	reducers: {
		addProduct: (state, action: PayloadAction<{ product: CreationProductType }>) => {
			const newProduct = { id: Date.now(), ...action.payload.product };
			state.products.push(newProduct);
		},
		updateProduct: (state, action: PayloadAction<{ product: Product }>) => {
			state.products = state.products.map(currProduct =>
				currProduct.id === action.payload.product.id ? action.payload.product : currProduct
			);
		},
		deleteProduct: (state, action: PayloadAction<{ productId: number }>) => {
			state.products = state.products.filter(
				currProduct => currProduct.id !== action.payload.productId
			);
		},
	},
	extraReducers: builder => {
		builder.addCase(getAllProducts.pending, state => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(getAllProducts.fulfilled, (state, action) => {
			state.isLoading = false;
			state.products = action.payload.products;
		});
		builder.addCase(getAllProducts.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.error.message || "Неизвестная ошибка";
		});

		builder.addCase(deleteAllProducts.pending, state => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(deleteAllProducts.fulfilled, state => {
			state.isLoading = false;
			state.products = [];
		});
		builder.addCase(deleteAllProducts.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.error.message || "Неизвестная ошибка";
		});
	},
});

export const { addProduct, updateProduct, deleteProduct } = adminProductsSlice.actions;
export const adminProductsReducer = adminProductsSlice.reducer;
