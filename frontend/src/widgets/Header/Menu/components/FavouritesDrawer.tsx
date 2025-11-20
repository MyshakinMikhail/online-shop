import { BaseProductsDrawer } from "@/shared/ui";
import { Heart } from "lucide-react";

export default function FavouritesDrawer() {
	return <BaseProductsDrawer Icon={Heart} title="Избранное" type="favourite" />;
}
