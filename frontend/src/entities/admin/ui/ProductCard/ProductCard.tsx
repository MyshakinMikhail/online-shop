import type { Product } from "@/shared/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Image, Tag, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../api/ProductService";
import { deleteProduct } from "../../model/adminProductsSlice";
import classes from "./ProductCard.module.css";
import { useDeleteProductNotification } from "./hooks";

const { Text } = Typography;

type Props = {
	product: Product;
};

export default function AdminProductCard({ product }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { contextHolder, showDeleteProductConfirm } = useDeleteProductNotification();
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		try {
			await ProductService.deleteProduct(product.id);
			dispatch(deleteProduct({ productId: product.id }));
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.message);
			} else {
				setError("Неизвестная ошибка при удалении товара");
			}
		}
	};

	const handleEdit = () => {
		navigate(`/admin/edit/product/${product.id}`);
	};

	if (error) {
		return (
			<Flex>
				<Text>Ошибка удаления товара: {error}</Text>
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
							onClick={() =>
								showDeleteProductConfirm({
									handleDelete,
									productName: product.name,
								})
							}
						>
							Удалить
						</Button>
					</Flex>
				</Flex>
			</Card>
		</>
	);
}
