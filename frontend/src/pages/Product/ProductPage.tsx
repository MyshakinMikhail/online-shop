import { mockMiniProducts } from "@/entities/product/model/mocks";
import type { Product } from "@/shared/types";

import { MyButton } from "@/shared/ui";
import { Header } from "@/widgets/Header";
import { Avatar, Flex, Typography } from "antd";
import { Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import classes from "./ProductPage.module.css";

const { Title, Text } = Typography;

export default function ProductPage() {
	const id = useParams().id || null;
	const product: Product | undefined =
		mockMiniProducts.find((item: Product) => item.id === id) || undefined;

	const handleClick = () => {
		console.log("buy smth");
	};

	return (
		<>
			<Header />
			<Flex className={classes.body} justify="center" gap="30px">
				<img
					src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
					width="600px"
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
						<MyButton onClick={handleClick} />{" "}
						{/* добавить в корзину и открыть ее */}
						<Avatar
							icon={<Heart className={classes.icon} />}
							className={classes.avatar}
						/>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
}
