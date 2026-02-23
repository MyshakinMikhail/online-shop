import { FavoriteProductsService } from "@/entities/favorites/api/FavoriteProductsService";
import { updateFavorites } from "@/entities/favorites/model/favoriteSlice";
import { addFavoriteItem, deleteFavoriteItem } from "@/entities/product/model/productsPageSlice";
import type { Product } from "@/shared/types";
import { HeartIcon } from "@/shared/ui";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./MainProductCard.module.css";

type Props = {
	product: Product;
};

export default function MainProductCard({ product }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handlePictureClick = () => {
		navigate(`/product/${product.id}`);
	};

	const handleIconClick = () => {
		if (!product.isFavorite) {
			dispatch(addFavoriteItem(product.id));
			FavoriteProductsService.addFavoriteProduct(product.id);
		} else {
			dispatch(deleteFavoriteItem(product.id));
			FavoriteProductsService.deleteFavoriteProduct(product.id);
		}
		dispatch(updateFavorites({ product }));
	};

	return (
		<div className={classes.card}>
			<img
				src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
				width="100%"
				height="auto"
				style={{ borderRadius: "10px" }}
				onClick={handlePictureClick}
				className={classes.image}
			/>
			<div className={classes.like}>
				<HeartIcon isFavorite={product.isFavorite} onClick={handleIconClick} />
			</div>
			<p className={classes.text}>{product.name}</p>
			<p className={classes.text}>{product.price} руб</p>
		</div>
	);
}
