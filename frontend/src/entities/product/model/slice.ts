import type { Product } from "@/shared/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Product[] = [];

const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		updateProducts: (state, action) => {
			if (action.payload) {
				state.length = 0;
				state.push(...action.payload);
			}
			// return action.payload;
		},
	},
});

export const { updateProducts } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
