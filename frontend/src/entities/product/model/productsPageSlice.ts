import type { Product } from "@/shared/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Product[] = [];

const productsPageSlice = createSlice({
	name: "productsPage",
	initialState,
	reducers: {
		updateProductsPage: (state, action) => {
			if (action.payload) {
				state.length = 0;
				state.push(...action.payload);
			}
			// return action.payload;
		},
	},
});

export const { updateProductsPage } = productsPageSlice.actions;
export const productsPageReducer = productsPageSlice.reducer;
