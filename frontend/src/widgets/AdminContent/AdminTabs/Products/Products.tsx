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

	const handleDeleteAllProducts = () => {
		ProductsService.deleteProducts();
		console.log("Добавить ручку удаления товара)");
	};

	const showError = () => {
		api.error({
			message: "Вы уверены, что хотите удалить все товары",
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
			duration: 60, // Закроется через 1 минуту
		});
	};

	useEffect(() => {
		const getProducts = async () => {
			const products = await ProductsService.getProducts(searchQuery);
			setProducts(products);
		};

		getProducts();
	}, [searchQuery]);

	return (
		<>
			<div className={classes.container}>
				{contextHolder}
				<Flex align="center" justify="space-between" gap={20}>
					<Input
						placeholder="Поиск товара"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
					<Button
						onClick={() => {
							navigate("/admin/create/product");
						}}
						variant="solid"
						color="default"
					>
						Добавить товар
					</Button>
					<Button
						onClick={() => {
							showError();
						}}
						variant="solid"
						color="danger"
					>
						Удалить все товары
					</Button>
				</Flex>
				{/* Сделать так, чтобы продукты приходили в постоянной сортировке */}
				{/* Также нужен slice для продуктов на админке, для рективного отображения действий */}
				{/* Нужно вынести логику из админский компонентов !!! */}
				{products.length > 0 ? (
					<Flex gap={20} justify="flex-start" align="center" className={classes.products}>
						{products.map((product: Product) => (
							<AdminProductCard key={product.id} product={product} />
						))}
					</Flex>
				) : (
					<Flex justify="center">
						<Text>Добавьте первый товар!</Text>
					</Flex>
				)}
			</div>
		</>
	);
}
