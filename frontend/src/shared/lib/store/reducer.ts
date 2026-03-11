import { adminProductsReducer } from "@/entities/admin/model/adminProductsSlice";
import { adminPromocodesReducer } from "@/entities/admin/model/adminPromocodesSlice";
import { cartReducer } from "@/entities/cart/model/slice";
import { categoryReducer } from "@/entities/categories/model/slice";
import { favoriteProductsReducer } from "@/entities/favorites/model/favoriteSlice";
import { productsPageReducer } from "@/entities/product/model/productsPageSlice";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
	category: categoryReducer,
	productsPage: productsPageReducer,
	cart: cartReducer,
	favoriteProducts: favoriteProductsReducer,
	adminProducts: adminProductsReducer,
	adminPromocodes: adminPromocodesReducer,
});
