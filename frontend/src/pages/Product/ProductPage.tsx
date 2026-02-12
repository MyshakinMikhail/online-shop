import { getProductsById } from "@/entities/product/api";
import { type Product } from "@/shared/types";
import { HeartIcon, MyButton } from "@/shared/ui";
import { Header } from "@/widgets/Header";
import { Flex, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from "./ProductPage.module.css";

const { Title, Text } = Typography;

export default function ProductPage() {
	const id = Number(useParams().id) || null;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const [product, setProduct] = useState<Product | null>(null);
	useEffect(() => {
		const fetchProduct = async () => {
			const product = await getProductsById({ id, setIsLoading, setError });
			setProduct(product);
		};

		fetchProduct();
	}, []);

	// const product: Product | undefined =
	// 	mockMiniProducts.find((item: Product) => item.id === id) || undefined;

	console.log(product);

	const handleClick = () => {
		console.log("buy smth");
	};

	if (isLoading) {
		return <Text>Загрузка товара..</Text>;
	}

	if (error) {
		return (
			<div>
				<Text> Ошибка загрузки</Text>
				<Text> {error}</Text>
			</div>
		);
	}

	return (
		<div className={classes.page}>
			<Header />
			<Flex className={classes.body}>
				<img
					src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
					width="530px"
					height="auto"
					style={{ borderRadius: "10px" }}
				/>
				<Flex className={classes.description} vertical gap={15}>
					<Title level={3}>{product?.name}</Title>
					<Text>Артикул: {product?.article}</Text>
					<Text>Цена: {product?.price}</Text>
					<Text>Описание: {product?.description}</Text>
					<Text>В наличии: {product?.stock} штук</Text>
					<Flex align="center" justify="center" gap={15}>
						<MyButton onClick={handleClick} />
						<HeartIcon />
					</Flex>
				</Flex>
			</Flex>
		</div>
	);
}
