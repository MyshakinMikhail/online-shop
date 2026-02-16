import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem extends Product {
	quantity: number;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		initCartProducts: (state, action: PayloadAction<CartItem[]>) => {
			return action.payload;
		},

		addProduct: (state, action: PayloadAction<Product>) => {
			const existingProduct = state.find(product => product.id === action.payload.id);

			if (existingProduct) {
				existingProduct.quantity += 1;
				return;
			}

			state.push({ ...action.payload, quantity: 1 });
		},

		updateProductQuantity: (
			state,
			action: PayloadAction<{ productId: number; quantity: number }>
		) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct && action.payload.quantity > 0) {
				existingProduct.quantity = action.payload.quantity;
			}
		},
		deleteProduct: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct) {
				return state.filter(product => product.id !== existingProduct.id);
			}
		},
		incrementQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct) {
				existingProduct.quantity += 1;
			}
		},

		decrementQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct) {
				existingProduct.quantity -= 1;
			}
		},

		clearCart: () => {
			return [];
		},
	},
});

export const {
	initCartProducts,
	addProduct,
	updateProductQuantity,
	deleteProduct,
	incrementQuantity,
	decrementQuantity,
	clearCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
