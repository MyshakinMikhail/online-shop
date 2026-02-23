import { deleteFavoriteItem } from "@/entities/product/model/productsPageSlice";
import type { Product } from "@/shared/types";
import { Button, Col, Image, Row, Typography } from "antd";
import { CircleX } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FavoriteProductsService } from "../../api/FavoriteProductsService";
import { updateFavorites } from "../../model/favoriteSlice";
import classes from "./ProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: Product;
	toggleDrawer: () => void;
};

export default function FavoriteProductCard({ product, toggleDrawer }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(deleteFavoriteItem(product.id));
		FavoriteProductsService.deleteFavoriteProduct(product.id);
		dispatch(updateFavorites({ product }));
	};

	return (
		<div>
			<Row align="middle" justify="space-evenly">
				<Col span={4}>
					<Image
						src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
						width={60}
						height="auto"
						style={{ borderRadius: "10px" }}
					/>
				</Col>
				<Col span={10}>
					<Text
						className={classes.description}
						onClick={() => {
							navigate(`/product/${product.id}`);
							toggleDrawer();
						}}
					>
						{product.name}
					</Text>
				</Col>

				<Col span={4}>
					<Text>{product.price} руб.</Text>
				</Col>
				<Col span={2}>
					<Button type="link" onClick={handleClick}>
						<CircleX style={{ border: 0, color: "#5B5B5B" }} />
					</Button>
				</Col>
			</Row>
		</div>
	);
}
