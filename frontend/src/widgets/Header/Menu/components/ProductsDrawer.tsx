import { mockMiniProducts } from "@/entities/product/model/mocks";
import { BaseProductsDrawer } from "@/shared/ui";
import { ShoppingCart } from "lucide-react";

export default function ProductsDrawer() {
	const products = mockMiniProducts;

	return (
		<>
			<BaseProductsDrawer
				products={products}
				Icon={ShoppingCart}
				title="Корзина"
				type="cart"
			/>
		</>
	);
}
