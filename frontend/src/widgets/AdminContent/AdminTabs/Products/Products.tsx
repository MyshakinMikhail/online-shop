import { ProductService } from "@/entities/admin/api/ProductService";
import { ProductsService } from "@/entities/admin/api/ProductsService";
import { AdminProductCard } from "@/entities/admin/ui";
import type { Product } from "@/shared/types";
import { Button, Flex, Input, notification, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Products.module.css";

const { Text } = Typography;

export default function Products() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);
	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();

	useEffect(() => {
		const getProducts = async () => {
			const products = await ProductsService.getProducts(searchQuery);
			setProducts(products);
		};

		getProducts();
	}, [searchQuery]);

	const handleDeleteProduct = async (productId: number) => {
		try {
			await ProductService.deleteProduct(productId);

			setProducts(prev => prev.filter(p => p.id !== productId));

			notification.destroy();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteAllProducts = async () => {
		try {
			await ProductsService.deleteProducts();
			setProducts([]);
			api.destroy();
		} catch (error) {
			console.error(error);
		}
	};

	const showDeleteAllConfirm = () => {
		api.error({
			message: "Вы уверены, что хотите удалить все товары?",
			description: (
				<Flex className={classes.alert}>
					<Text className={classes.alertText}>
						Данное действие нельзя будет отменить!
					</Text>
					<Button variant="solid" color="danger" onClick={handleDeleteAllProducts}>
						Удалить все товары
					</Button>
				</Flex>
			),
			placement: "top",
			duration: 60,
		});
	};

	return (
		<div className={classes.container}>
			{contextHolder}

			<Flex align="center" justify="space-between" gap={20}>
				<Input
					placeholder="Поиск товара"
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>

				<Button onClick={() => navigate("/admin/create/product")} variant="solid">
					Добавить товар
				</Button>

				<Button onClick={showDeleteAllConfirm} variant="solid" color="danger">
					Удалить все товары
				</Button>
			</Flex>

			{products.length > 0 ? (
				<Flex gap={20} justify="flex-start" align="center" className={classes.products}>
					{products.map(product => (
						<AdminProductCard
							key={product.id}
							product={product}
							onDelete={handleDeleteProduct}
						/>
					))}
				</Flex>
			) : (
				<Flex justify="center">
					<Text>Добавьте первый товар!</Text>
				</Flex>
			)}
		</div>
	);
}
