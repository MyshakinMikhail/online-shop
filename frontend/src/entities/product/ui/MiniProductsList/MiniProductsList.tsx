import type { Product, ProductCardType } from "@/shared/types";
import { BaseMiniProductCard } from "@/shared/ui";
import { Flex } from "antd";
import { mockProducts } from "../../model/mocks";
import classes from "./MiniProductsList.module.css";

type Props = {
	type: ProductCardType;
};

export default function MiniProductsList({ type }: Props) {
	const products = mockProducts;

	return (
		<Flex className={classes.products}>
			{products.map((product: Product) => (
				<BaseMiniProductCard product={product} type={type} />
			))}
		</Flex>
	);
}
