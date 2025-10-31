import type { Product } from "@/shared/types";
import { useNavigate } from "react-router-dom";
import classes from "./MainProductCard.module.css";

type Props = {
	product: Product;
};

export default function MainProductCard({ product }: Props) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/products/${product.id}`);
	};

	return (
		<div className={classes.card} onClick={handleClick}>
			<img
				src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
				width="100%"
				height="auto"
				style={{ borderRadius: "10px" }}
				className={classes.image}
			/>
			<p className={classes.text}>{product.name}</p>
			<p className={classes.text}>{product.price} руб</p>
		</div>
	);
}
