import { ProductsService } from "@/entities/admin/api/ProductsService";
import { deleteAllProducts } from "@/entities/admin/model/adminProductsSlice";
import { getAllProducts } from "@/entities/admin/model/asyncThunks/getAllProducts";
import { AdminProductsList } from "@/entities/admin/ui/ProductsList/ProductsList";
import { type AppDispatch } from "@/shared/lib/store";
import { Button, Flex, Input, notification, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classes from "./Products.module.css";

const { Text } = Typography;

export default function Products() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchProducts = async () => {
			dispatch(getAllProducts({ searchQuery }));
		};
		fetchProducts();
	}, [dispatch, searchQuery]);

	const handleDeleteAllProducts = async () => {
		try {
			dispatch(deleteAllProducts());
			ProductsService.deleteProducts();
			api.destroy();
		} catch (e) {
			console.error(e);
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

			<AdminProductsList />
		</div>
	);
}
