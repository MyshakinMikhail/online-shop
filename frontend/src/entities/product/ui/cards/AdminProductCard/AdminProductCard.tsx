import { Button, Flex, Image } from "antd";
import { useNavigate } from "react-router-dom";
import classes from "./AdminProductCard.module.css";
import type { Product } from "@/shared/types";

type Props = {
	product: Product;
};

export default function AdminProductCard({ product }: Props) {
	const navigate = useNavigate();
	const handleDelete = () => {};
	const handleEdit = () => {
		navigate(`/admin/main/edit/product/${product.id}`, { replace: true });
	};

	return (
		<>
			<Flex vertical gap={10} justify="center" align="center" className={classes.container}>
				<Image
					src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
					width="200px"
					height="auto"
					className={classes.image}
				/>
				<Flex gap={10}>
					<Button onClick={handleEdit}>Редактировать</Button>
					<Button onClick={handleDelete}>Удалить</Button>
				</Flex>
			</Flex>
		</>
	);
}
