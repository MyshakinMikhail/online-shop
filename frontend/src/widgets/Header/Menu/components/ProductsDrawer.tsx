import { BaseDrawer } from "@/shared/ui";
import { ShoppingCart } from "lucide-react";

export default function ProductsDrawer() {
	return (
		<>
			<BaseDrawer Icon={ShoppingCart} title="Корзина" type="cart" />
		</>
	);
}
