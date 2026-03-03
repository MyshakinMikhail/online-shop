import type { Product } from "@/shared/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Image, notification, Tag, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ProductCard.module.css";

const { Text } = Typography;

type Props = {
	product: Product;
	onDelete: (id: number) => void;
};

export default function AdminProductCard({ product, onDelete }: Props) {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [api, contextHolder] = notification.useNotification();

	const handleDelete = async () => {
		try {
			await onDelete(product.id);
			notification.destroy();
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.message);
			} else {
				setError("Неизвестная ошибка при удалении товара");
			}
		}
	};

	const showDeletedProduct = () => {
		api.error({
			message: "Вы уверены, что хотите удалить товар?",
			description: (
				<Flex className={classes.alert}>
					<Text className={classes.alertText}>
						Данное действие нельзя будет отменить!
					</Text>
					<Button variant="solid" color="danger" onClick={handleDelete}>
						Удалить товар {product.name}
					</Button>
				</Flex>
			),
			placement: "top",
			duration: 60,
		});
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

						<Button danger icon={<DeleteOutlined />} onClick={showDeletedProduct}>
							Удалить
						</Button>
					</Flex>
				</Flex>
			</Card>
		</>
	);
}
