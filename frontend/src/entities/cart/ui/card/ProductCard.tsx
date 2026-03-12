import {
	decrementCartProductQuantity,
	deleteCartProduct,
	incrementCartProductQuantity,
	type CartItem,
} from "@/entities/cart/model/slice";
import { QuantityControl } from "@/shared/ui";
import { Button, Image, Typography } from "antd";
import { isAxiosError } from "axios";
import { CircleX } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartServise } from "../../api/CartServise";
import classes from "./ProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: CartItem;
	toggleDrawer?: () => void;
};

export default function CartProductCard({ product, toggleDrawer }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const decrement = async () => {
		try {
			if (product.quantity === 1) {
				await CartServise.deleteProduct(product.id);
				dispatch(deleteCartProduct({ productId: product.id }));
				return;
			}
			await CartServise.updateQuantity(product.id, false);
			dispatch(decrementCartProductQuantity({ productId: product.id }));
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.response?.data.message);
			} else {
				console.error("Неизвестная ошибка при удалении товара из корзины");
			}
		}
	};

	const increment = async () => {
		try {
			await CartServise.updateQuantity(product.id, true);
			dispatch(incrementCartProductQuantity({ productId: product.id }));
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.response?.data.message);
			} else {
				console.error("Неизвестная ошибка при увеличении количества товара в корзине");
			}
		}
	};

	const handleDelete = async () => {
		try {
			await CartServise.deleteProduct(product.id);
			dispatch(deleteCartProduct({ productId: product.id }));
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.response?.data.message);
			} else {
				console.error("Неизвестная ошибка при удалении товара из корзины");
			}
		}
	};

	return (
		<div className={classes.card}>
			<Image
				src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
				width={60}
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

				<Button type="text" onClick={handleDelete}>
					<CircleX size={20} />
				</Button>
			</div>
		</div>
	);
}
