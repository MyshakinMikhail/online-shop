import { cartReducer } from "@/entities/cart/model/slice";
import { categoryReducer } from "@/entities/categories/model/slice";
import { productsReducer } from "@/entities/product/model/slice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
	category: categoryReducer,
	products: productsReducer,
	cart: cartReducer,
});
