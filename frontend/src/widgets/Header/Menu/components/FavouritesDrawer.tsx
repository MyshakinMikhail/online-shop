import { mockMiniProducts } from "@/entities/product/model/mocks";
import { BaseProductsDrawer } from "@/shared/ui";
import { Heart } from "lucide-react";

export default function FavouritesDrawer() {
	const products = mockMiniProducts; // убрать моки !!!

	return (
		<BaseProductsDrawer products={products} Icon={Heart} title="Избранное" type="favourite" />
	);
}
