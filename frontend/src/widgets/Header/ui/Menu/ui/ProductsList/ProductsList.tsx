import { Flex } from "antd";
import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../ProductCard/types";
import { mockProducts } from "./mocks";
import classes from "./ProductsList.module.css";

export default function ProductsList() {
	const products = mockProducts;

	return (
		<Flex className={classes.products}>
			{products.map((product: Product) => (
				<ProductCard product={product} />
			))}
		</Flex>
	);
}
