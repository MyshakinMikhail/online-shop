import type { Product } from "@/shared/types";
import { Flex, Image, Typography } from "antd";
import classes from "./SearchProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: Product;
};

export default function SearchProductCard({ product }: Props) {
	return (
		<Flex gap={7}>
			<Image
				src="https://static.tildacdn.com/stor3034-3833-4231-b739-386661316332/71199357.jpg"
				width="auto"
				height={100}
				className={classes.image}
			/>
			<Flex vertical>
				<Text>{product.name}</Text>
				<Text>{product.price}</Text>
				<Text>артикул: {product.article}</Text>
			</Flex>
		</Flex>
	);
}
