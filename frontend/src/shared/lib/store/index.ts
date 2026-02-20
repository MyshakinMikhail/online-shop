import { getAllProducts } from "@/entities/product/model/getAllProducts";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

export const store = configureStore({
	reducer: rootReducer,
});

store.dispatch(getAllProducts()); // глобальный инит стора ( пока что инитится только все продукты ) !!!

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
