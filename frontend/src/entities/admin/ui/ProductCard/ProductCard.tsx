import type { Product } from "@/shared/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Image, notification, Tag, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../api/ProductService";
import classes from "./ProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: Product;
};

export default function AdminProductCard({ product }: Props) {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const [api, contextHolder] = notification.useNotification();

	const showDeletedProduct = () => {
		api.success({
			message: "Статус товара",
			description: "Товар успешно удален с сервера",
			placement: "top",
			duration: 3,
		});
	};

	const handleDelete = async (productId: number) => {
		try {
			const createdProduct = await ProductService.deleteProduct(productId);
			if (createdProduct) {
				showDeletedProduct();
				setTimeout(() => {
					navigate("/admin/main");
				}, 3000);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.message);
			} else {
				setError("Неизвестная ошибка при добавлении товара на сервер");
			}
		}
	};

	const handleEdit = () => {
		navigate(`/admin/edit/product/${product.id}`);
	};

	if (error) {
		return (
			<Flex>
				<Text> Ошибка удаления товара: </Text>
				<Text> {error}</Text>
			</Flex>
		);
	}

	return (
		<>
			{contextHolder}
			<Card hoverable className={classes.container} bodyStyle={{ padding: 16 }}>
				<Image
					preview={false}
					src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
					className={classes.image}
				/>

				<Flex vertical className={classes.content} gap={6}>
					<Flex justify="space-between" align="center">
						<Text className={classes.title}>{product.name}</Text>
						<Tag color={product.isActive ? "green" : "red"}>
							{product.isActive ? "Активен" : "Не активен"}
						</Tag>
					</Flex>

					<Text className={classes.description}>{product.description}</Text>

					<Text className={classes.price}>{product.price} ₽</Text>

					<Flex gap={10} className={classes.footer}>
						<Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
							Редактировать
						</Button>

						<Button
							danger
							icon={<DeleteOutlined />}
							onClick={() => handleDelete(product.id)}
						>
							Удалить
						</Button>
					</Flex>
				</Flex>
			</Card>
		</>
	);
}
