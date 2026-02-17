import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CartServise } from "../api/CartServise";

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
				CartServise.updateQuantity(action.payload.id, true);
				return;
			}

			state.push({ ...action.payload, quantity: 1 });
			CartServise.addProduct(action.payload.id);
		},

		deleteProduct: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct) {
				CartServise.deleteProduct(existingProduct.id);
				return state.filter(product => product.id !== existingProduct.id);
			}
		},
		incrementQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct) {
				existingProduct.quantity += 1;
				CartServise.updateQuantity(existingProduct.id, true);
			}
		},

		decrementQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.find(product => product.id === action.payload.productId);
			if (existingProduct) {
				existingProduct.quantity -= 1;
				CartServise.updateQuantity(existingProduct.id, false);
			}
		},

		clearCart: () => {
			CartServise.deleteCart();
			return [];
		},
	},
});

export const {
	initCartProducts,
	addProduct,
	deleteProduct,
	incrementQuantity,
	decrementQuantity,
	clearCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
