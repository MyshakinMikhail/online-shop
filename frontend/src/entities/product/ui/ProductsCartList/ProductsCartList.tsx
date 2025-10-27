import { Flex } from "antd";
import { mockProducts } from "../../model/mocks";
import type { Product } from "../../model/types";
import ProductCartCard from "../ProductCartCard/ProductCartCard";
import classes from "./ProductsCartList.module.css";

export default function ProductsCartList() {
	const products = mockProducts;

	return (
		<Flex className={classes.products}>
			{products.map((product: Product) => (
				<ProductCartCard product={product} />
			))}
		</Flex>
	);
}
