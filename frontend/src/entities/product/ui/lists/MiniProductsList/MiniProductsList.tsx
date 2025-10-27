import type { Product, ProductCardType } from "@/shared/types";
import { Flex } from "antd";
import { mockMiniProducts } from "../../../model/mocks";
import BaseMiniProductCard from "../../cards/BaseMiniProductCard/BaseMiniProductCard";
import classes from "./MiniProductsList.module.css";

type Props = {
	type: ProductCardType;
};

export default function MiniProductsList({ type }: Props) {
	const products = mockMiniProducts;

	return (
		<Flex className={classes.products}>
			{products.map((product: Product) => (
				<BaseMiniProductCard product={product} type={type} />
			))}
		</Flex>
	);
}
