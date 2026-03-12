import { deleteAllProducts } from "@/entities/admin/model/asyncThunks";
import { getAllProducts } from "@/entities/admin/model/asyncThunks/getAllProducts";
import { AdminProductsList } from "@/entities/admin/ui/ProductsList/ProductsList";
import { type AppDispatch, type RootState } from "@/shared/lib/store";
import { Button, Flex, Input, Spin, Typography } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteAllProductsNotification } from "./hooks";
import classes from "./Products.module.css";

const { Text } = Typography;

export default function Products() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const navigate = useNavigate();
	const { isLoading, error } = useSelector((state: RootState) => state.adminProducts);
	const dispatch = useDispatch<AppDispatch>();
	const { contextHolder, hideDeleteAllProductsConfirm, showDeleteAllProductsConfirm } =
		useDeleteAllProductsNotification();

	useEffect(() => {
		const fetchProducts = async () => {
			dispatch(getAllProducts({ searchQuery }));
		};
		fetchProducts();
	}, [dispatch, searchQuery]);

	const handleDeleteAllProducts = async () => {
		try {
			dispatch(deleteAllProducts());
			hideDeleteAllProductsConfirm();
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.response?.data.message);
			} else {
				console.error("Неизвестная ошибка при удалении всех товаров");
			}
		}
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

				<Button
					onClick={() => showDeleteAllProductsConfirm({ handleDeleteAllProducts })}
					variant="solid"
					color="danger"
				>
					Удалить все товары
				</Button>
			</Flex>
			{isLoading ? <Spin className={classes.spinner} size="large" /> : null}
			{error && (
				<Flex>
					<Text>Ошибка загрузки товаров: </Text>
					<Text>{error}</Text>
				</Flex>
			)}
			<AdminProductsList />
		</div>
	);
}
