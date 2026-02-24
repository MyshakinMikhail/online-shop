import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CartServise } from "../api/CartServise";
import { getCartProducts } from "./asyncThunks";

export interface CartItem extends Product {
	quantity: number;
}

type CartState = {
	products: CartItem[];
	totalPrice: number;
	isLoading: boolean;
	error: string | null;
};

const initialState: CartState = { products: [], totalPrice: 0, isLoading: false, error: null };

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addProduct: (state, action: PayloadAction<Product>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.id
			);

			if (existingProduct) {
				existingProduct.quantity += 1;
				CartServise.updateQuantity(action.payload.id, true);
				return;
			}

			state.products.push({ ...action.payload, quantity: 1 });
			CartServise.addProduct(action.payload.id);
		},

		deleteProduct: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.productId
			);
			if (existingProduct) {
				CartServise.deleteProduct(existingProduct.id);
				state.products = state.products.filter(
					product => product.id !== existingProduct.id
				);
			}
		},
		incrementQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.productId
			);
			if (existingProduct) {
				existingProduct.quantity += 1;
				CartServise.updateQuantity(existingProduct.id, true);
			}
		},

		decrementQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.productId
			);
			if (existingProduct) {
				existingProduct.quantity -= 1;
				CartServise.updateQuantity(existingProduct.id, false);
			}
		},

		clearCart: state => {
			CartServise.deleteCart();
			state.products = [];
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getCartProducts.pending, state => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getCartProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload.items;
				state.totalPrice = action.payload.totalSum;
			})
			.addCase(getCartProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || "Неизвестная ошибка";
			});
	},
});

export const { addProduct, deleteProduct, incrementQuantity, decrementQuantity, clearCart } =
	cartSlice.actions;

export const cartReducer = cartSlice.reducer;
