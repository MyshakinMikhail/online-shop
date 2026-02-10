import { getCurrentCategory } from "@/entities/categories/model/thunk";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

export const store = configureStore({
	reducer: rootReducer,
});

const slug = window.location.pathname.split("/").pop();

if (slug) {
	store.dispatch(getCurrentCategory(slug));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
