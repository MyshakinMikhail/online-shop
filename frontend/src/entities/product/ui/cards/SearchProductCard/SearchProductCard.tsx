import { useSearch } from "@/shared/hooks";
import type { Product } from "@/shared/types";
import { Flex, Image, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import classes from "./SearchProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: Product;
	toggleDrawer: () => void;
};

export default function SearchProductCard({ product, toggleDrawer }: Props) {
	const navigate = useNavigate();
	const { setContent } = useSearch();

	const handleClick = () => {
		setContent("");
		toggleDrawer();
		navigate(`/products/${product.id}`);
	};

	console.log(product);
	return (
		<div className={classes.container} onClick={handleClick}>
			<Image
				src="https://static.tildacdn.com/stor3034-3833-4231-b739-386661316332/71199357.jpg"
				width="auto"
				height={100}
				className={classes.image}
			/>
			<Flex className={classes.info} vertical>
				<Text onClick={handleClick} className={classes.name}>
					{product.name}
				</Text>
				<Text>цена: {product.price} руб.</Text>
				<Text>осталось: {product.stock} шт</Text>
			</Flex>
		</div>
	);
}
