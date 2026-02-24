import { getCartProducts } from "@/entities/cart/model/asyncThunks";
import { getCurrentCategory } from "@/entities/categories/model/asyncThunks";
import { getFavoriteProducts } from "@/entities/favorites/model/asyncThunks";
import { getCurrProductsByCategoryId } from "@/entities/product/model/asyncThunks";
import { store } from ".";

export const initStore = async () => {
	const category = await store.dispatch(getCurrentCategory()).unwrap();

	if (category.id) {
		store.dispatch(getCurrProductsByCategoryId({ categoryId: category.id }));
	}

	store.dispatch(getFavoriteProducts());
	store.dispatch(getCartProducts());
};
