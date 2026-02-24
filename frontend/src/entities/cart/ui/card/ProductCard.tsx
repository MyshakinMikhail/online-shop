import {
	decrementQuantity,
	deleteProduct,
	incrementQuantity,
	type CartItem,
} from "@/entities/cart/model/slice";
import { QuantityControl } from "@/shared/ui";
import { Button, Image, Typography } from "antd";
import { CircleX } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./ProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: CartItem;
	toggleDrawer?: () => void;
};

export default function CartProductCard({ product, toggleDrawer }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const decrement = () => {
		if (product.quantity === 1) {
			dispatch(deleteProduct({ productId: product.id }));
			return;
		}
		dispatch(decrementQuantity({ productId: product.id }));
	};

	const increment = () => {
		dispatch(incrementQuantity({ productId: product.id }));
	};

	return (
		<div className={classes.card}>
			<Image
				src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
				width={60}
				// preview={false}
				className={classes.image}
			/>

			<div className={classes.info}>
				<Text
					className={classes.description}
					onClick={() => {
						navigate(`/product	/${product.id}`);
						if (toggleDrawer) toggleDrawer();
					}}
				>
					{product.name}
				</Text>

				<Text className={classes.price}>{product.price} руб.</Text>
			</div>

			<div className={classes.controls}>
				<QuantityControl
					count={product.quantity}
					increment={increment}
					decrement={decrement}
				/>

				<Button
					type="text"
					onClick={() => dispatch(deleteProduct({ productId: product.id }))}
				>
					<CircleX size={20} />
				</Button>
			</div>
		</div>
	);
}
