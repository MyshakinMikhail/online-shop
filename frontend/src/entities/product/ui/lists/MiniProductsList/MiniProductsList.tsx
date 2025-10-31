import type { Product, ProductCardType } from "@/shared/types";
import { Flex, Typography } from "antd";
import { useState } from "react";
import { mockMiniProducts } from "../../../model/mocks";
import MiniProductCard from "../../cards/MiniProductCard/MiniProductCard";
import classes from "./MiniProductsList.module.css";

const { Paragraph } = Typography;

type Props = {
	type: ProductCardType;
};

export default function MiniProductsList({ type }: Props) {
	const [products, setProducts] = useState<Product[]>(mockMiniProducts);

	const handleDelete = (id: string) => {
		setProducts((prevProducts) =>
			prevProducts.filter((product) => product.id !== id)
		);
	};

	return (
		<>
			{products.length === 0 ? (
				<Paragraph>Товары не добавлены</Paragraph>
			) : null}
			<Flex className={classes.products}>
				{products.map((product: Product) => (
					<MiniProductCard
						product={product}
						type={type}
						handleDelete={handleDelete}
					/>
				))}
			</Flex>
		</>
	);
}
