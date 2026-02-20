import { AdminProductCard } from "@/entities/admin/ui";
import { mockMiniProducts } from "@/entities/product/model/mocks";
import type { Product } from "@/shared/types";
import { Button, Flex, Input } from "antd";
import classes from "./Products.module.css";

export default function Products() {
	const products = mockMiniProducts;
	return (
		<div className={classes.container}>
			<Flex align="center" justify="space-between" gap={20}>
				<Input placeholder="Поиск товара" />
				<Button>Добавить товар</Button>
			</Flex>
			<Flex gap={20} justify="flex-start" align="center" className={classes.products}>
				{products.map((product: Product) => (
					<AdminProductCard product={product} />
				))}
			</Flex>
		</div>
	);
}
