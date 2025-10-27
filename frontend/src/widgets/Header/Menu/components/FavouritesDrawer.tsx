import { BaseDrawer } from "@/shared/ui";
import { Heart } from "lucide-react";

export default function FavouritesDrawer() {
	return <BaseDrawer Icon={Heart} title="Избранное" type="favourite" />;
}
