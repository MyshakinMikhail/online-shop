import { cartReducer } from "@/entities/cart/model/slice";
import { categoryReducer } from "@/entities/categories/model/slice";
import { productsPageReducer } from "@/entities/product/model/productsPageSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
	category: categoryReducer,
	productsPage: productsPageReducer,
	cart: cartReducer,
});
