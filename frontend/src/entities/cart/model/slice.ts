import type { Product } from "@/shared/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
		addCartProduct: (state, action: PayloadAction<Product>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.id
			);

			if (existingProduct) {
				existingProduct.quantity += 1;
				state.totalPrice += existingProduct.price;
				return;
			}

			state.totalPrice += action.payload.price;
			state.products.push({ ...action.payload, quantity: 1 });
		},

		deleteCartProduct: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.productId
			);
			if (existingProduct) {
				state.totalPrice -= existingProduct.price * existingProduct.quantity;
				state.products = state.products.filter(
					product => product.id !== existingProduct.id
				);
			}
		},
		incrementCartProductQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.productId
			);
			if (existingProduct) {
				existingProduct.quantity += 1;
				state.totalPrice += existingProduct.price;
			}
		},

		decrementCartProductQuantity: (state, action: PayloadAction<{ productId: number }>) => {
			const existingProduct = state.products.find(
				product => product.id === action.payload.productId
			);
			if (existingProduct) {
				existingProduct.quantity -= 1;
				state.totalPrice -= existingProduct.price;
			}
		},

		clearCart: state => {
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

export const {
	addCartProduct,
	deleteCartProduct,
	incrementCartProductQuantity,
	decrementCartProductQuantity,
	clearCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
