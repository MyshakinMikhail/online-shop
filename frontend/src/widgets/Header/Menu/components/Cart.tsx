import { initCartProducts } from "@/entities/cart/model/slice";
import { api } from "@/shared/api";
import type { CartItemType } from "@/shared/types";
import type { YandexUserInfo } from "@/shared/types/yandexUserInfo";
import { BaseProductsDrawer } from "@/shared/ui";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Cart() {
	// const products = mockMiniProducts;
	const user: YandexUserInfo = JSON.parse(localStorage.getItem("user_info") || "null");
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const response = await api.get(`/cart/${user.id}`);
				const items = response.data.cart.items.map((item: CartItemType) => ({
					...item.product,
					quantity: item.quantity,
				}));

				dispatch(initCartProducts(items));
				// console.log(items);
			} catch (e) {
				console.log(e);
			}
		};

		fetchCart();
	}, []);

	return (
		<>
			<BaseProductsDrawer Icon={ShoppingCart} title="Корзина" type="cart" />
		</>
	);
}
