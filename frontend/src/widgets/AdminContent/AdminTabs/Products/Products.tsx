import { ProductsService } from "@/entities/admin/api/ProductsService";
import { AdminProductCard } from "@/entities/admin/ui";
import type { Product } from "@/shared/types";
import { Button, Flex, Input } from "antd";
import { useEffect, useState } from "react";
import classes from "./Products.module.css";

export default function Products() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const getProducts = async () => {
			const products = await ProductsService.getProducts(searchQuery);
			setProducts(products);
		};

		getProducts();
	}, [searchQuery]);

	return (
		<div className={classes.container}>
			<Flex align="center" justify="space-between" gap={20}>
				<Input
					placeholder="Поиск товара"
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<Button>Добавить товар</Button>
			</Flex>
			<Flex gap={20} justify="flex-start" align="center" className={classes.products}>
				{products.map((product: Product) => (
					<AdminProductCard key={product.id} product={product} />
				))}
			</Flex>
		</div>
	);
}
