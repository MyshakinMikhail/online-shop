import { deleteAllProducts } from "@/entities/admin/model/asyncThunks";
import { getAllProducts } from "@/entities/admin/model/asyncThunks/getAllProducts";
import { AdminProductsList } from "@/entities/admin/ui/ProductsList/ProductsList";
import { type AppDispatch } from "@/shared/lib/store";
import { Button, Flex, Input } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteAllProductsNotification } from "./hooks";
import classes from "./Products.module.css";

export default function Products() {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const navigate = useNavigate();
	const { contextHolder, hideDeleteAllProductsConfirm, showDeleteAllProductsConfirm } =
		useDeleteAllProductsNotification();
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
					onClick={() =>
						showDeleteAllProductsConfirm({ handleDeleteAllProducts })
					}
					variant="solid"
					color="danger"
				>
					Удалить все товары
				</Button>
			</Flex>

			<AdminProductsList />
		</div>
	);
}
