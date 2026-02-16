import {
	decrementQuantity,
	deleteProduct,
	incrementQuantity,
	type CartItem,
} from "@/entities/cart/model/slice";
import type { ProductCardType } from "@/shared/types";
import { QuantityControl } from "@/shared/ui";
import { Button, Col, Image, Row, Typography } from "antd";
import { CircleX } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./MiniProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: CartItem;
	type: ProductCardType;
	toggleDrawer: () => void;
};

export default function MiniProductCard({ product, type, toggleDrawer }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const decrement = () => {
		if (product.quantity === 1) {
			dispatch(deleteProduct({ productId: product.id }));
		}
		dispatch(decrementQuantity({ productId: product.id }));
	};
	const increment = () => {
		dispatch(incrementQuantity({ productId: product.id }));
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
							navigate(`/products/${product.id}`);
							toggleDrawer();
						}}
					>
						{product.name}
					</Text>
				</Col>
				{type === "cart" && (
					<Col span={4}>
						<QuantityControl
							count={product.quantity}
							increment={increment}
							decrement={decrement}
						/>
					</Col>
				)}
				<Col span={4}>
					<Text>{product.price} руб.</Text>
				</Col>
				<Col span={2}>
					<Button
						type="link"
						onClick={() => {
							dispatch(deleteProduct({ productId: product.id }));
						}}
					>
						<CircleX style={{ border: 0, color: "#5B5B5B" }} />
					</Button>
				</Col>
			</Row>
		</div>
	);
}
