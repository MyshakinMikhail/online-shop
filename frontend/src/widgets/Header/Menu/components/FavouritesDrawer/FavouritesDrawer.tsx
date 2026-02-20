import { FavoriteProductsService } from "@/entities/favorites/api/FavoriteProductsService";
import { FavoriteProductsList } from "@/entities/favorites/ui";
import { deleteAllFavoriteItems } from "@/entities/product/model/productsPageSlice";
import type { AppDispatch } from "@/shared/lib/store";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Drawer, Flex } from "antd";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function FavoritesDrawer() {
	const [open, setOpen] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();

	const toggleDrawer = () => {
		setOpen(open => !open);
	};

	const handleDelete = () => {
		dispatch(deleteAllFavoriteItems());
		FavoriteProductsService.deleteAllFavoriteProducts();
	};

	return (
		<>
			<MenuIcon Icon={Heart} onClick={toggleDrawer} />
			<Drawer
				title="Избранное"
				width={450}
				placement="right"
				open={open}
				onClose={toggleDrawer}
			>
				<FavoriteProductsList toggleDrawer={toggleDrawer} />
				<Flex>
					<Flex justify="center" align="center" gap={5}>
						<MyButton label="Очистить избранное" onClick={handleDelete} />
					</Flex>
				</Flex>
			</Drawer>
		</>
	);
}
