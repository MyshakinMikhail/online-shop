import { getCartProducts } from "@/entities/cart/model/asyncThunks";
import { getCurrentCategory } from "@/entities/categories/model/asyncThunks";
import { getFavoriteProducts } from "@/entities/favorites/model/asyncThunks";
import { getCurrProductsByCategoryId } from "@/entities/product/model/asyncThunks";
import { store } from ".";

export const initStore = async () => {
	const { currCategory } = await store.dispatch(getCurrentCategory()).unwrap();

	if (currCategory.id) {
		store.dispatch(getCurrProductsByCategoryId({ categoryId: currCategory.id }));
	}

	store.dispatch(getFavoriteProducts());
	store.dispatch(getCartProducts());
};
