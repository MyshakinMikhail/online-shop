import { categoryReducer } from "@/entities/categories/model/slice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
	category: categoryReducer,
});
