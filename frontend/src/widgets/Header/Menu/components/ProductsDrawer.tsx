import { BaseProductsDrawer } from "@/shared/ui";
import { ShoppingCart } from "lucide-react";

export default function ProductsDrawer() {
	return (
		<>
			<BaseProductsDrawer
				Icon={ShoppingCart}
				title="Корзина"
				type="cart"
			/>
		</>
	);
}
