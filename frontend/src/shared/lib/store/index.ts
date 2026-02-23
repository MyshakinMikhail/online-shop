import { getCartProducts } from "@/entities/cart/model/asyncThunks";
import { getCurrentCategory } from "@/entities/categories/model/asyncThunks";
import { getFavoriteProducts } from "@/entities/favorites/model/asyncThunks";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

export const store = configureStore({
	reducer: rootReducer,
});

const initStore = async () => {
	console.log("initStore");
	store.dispatch(getFavoriteProducts());
	store.dispatch(getCurrentCategory());
	store.dispatch(getCartProducts());
};

initStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
