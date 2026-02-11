import type { Product } from "@/shared/types";
import { HeartIcon } from "@/shared/ui";
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
		<div className={classes.card}>
			<img
				src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
				width="100%"
				height="auto"
				style={{ borderRadius: "10px" }}
				onClick={handleClick}
				className={classes.image}
			/>
			<div className={classes.like}>
				<HeartIcon />
			</div>
			<p className={classes.text}>{product.name}</p>
			<p className={classes.text}>{product.price} руб</p>
		</div>
	);
}
