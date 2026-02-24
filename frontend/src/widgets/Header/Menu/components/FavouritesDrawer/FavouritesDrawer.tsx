import { FavoriteProductsService } from "@/entities/favorites/api/FavoriteProductsService";
import { deleteAllFavorites } from "@/entities/favorites/model/favoriteSlice";
import { FavoriteProductsList } from "@/entities/favorites/ui";
import { deleteAllFavoriteItems } from "@/entities/product/model/productsPageSlice";
import type { RootState } from "@/shared/lib/store";
import { MenuIcon, MyButton } from "@/shared/ui";
import { Drawer, Flex } from "antd";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function FavoritesDrawer() {
	const [open, setOpen] = useState<boolean>(false);
	const dispatch = useDispatch();
	const { favorites } = useSelector((state: RootState) => state.favoriteProducts);

	const toggleDrawer = () => {
		setOpen(open => !open);
	};

	const handleDelete = () => {
		FavoriteProductsService.deleteAllFavoriteProducts();
		dispatch(deleteAllFavoriteItems());
		dispatch(deleteAllFavorites());
	};

	return (
		<>
			<MenuIcon totalCount={favorites.length} Icon={Heart} onClick={toggleDrawer} />
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
