import { getCurrentCategory } from "@/entities/categories/model/asyncThunks";
import { getAllProducts } from "@/entities/product/model/asyncThunks";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

export const store = configureStore({
	reducer: rootReducer,
});

const initStore = async () => {
	console.log("initStore");
	store.dispatch(getAllProducts());
	// store.dispatch(getCartProducts());
	store.dispatch(getCurrentCategory());
};

initStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
