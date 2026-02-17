import { getProductsByCategoryId } from "@/entities/product/api/getProductsByCategoryId";
import { updateProductsPage } from "@/entities/product/model/productsPageSlice";
import MainProductsList from "@/entities/product/ui/lists/MainProductsList/MainProductsList";
import type { RootState } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { Flex, Pagination, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ProductsPage.module.css";

const { Text } = Typography;

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [currPage, setCurrPage] = useState<number>(1);
	const [total, setTotal] = useState<number>();
	const [limit, setLimit] = useState<number>(16);
	const category = useSelector((state: RootState) => state.category.category);
	const dispatch = useDispatch();

	// добавить текущая страница в slice к продуктам !!!
	useEffect(() => {
		setCurrPage(1);
	}, [category]);

	useEffect(() => {
		const fetchProducts = async () => {
			await getProductsByCategoryId({
				categoryId: category?.id,
				setIsLoading,
				setError,
				setTotal,
				setProducts,
				currPage,
				limit,
			});
		};

		fetchProducts();
	}, [category, currPage, limit]);

	useEffect(() => {
		if (products) {
			dispatch(updateProductsPage(products));
		}
	}, [products, dispatch]);

	if (isLoading) {
		return <Flex justify="center">Загрузка...</Flex>;
	}

	if (error) {
		return (
			<div>
				<Text>Ошибка получения продукта: </Text>
				<Text>{error}</Text>
			</div>
		);
	}

	return (
		<div className={classes.container}>
			<MainProductsList products={products} />
			<div className={classes.footer}>
				<Pagination
					style={{ padding: "20px" }}
					align="center"
					pageSize={limit}
					defaultCurrent={currPage}
					total={total}
					onChange={page => {
						setCurrPage(page);
					}}
				/>
				<Select
					defaultValue={limit}
					style={{ width: 120 }}
					onChange={value => setLimit(value)}
					options={[
						{ label: "8 продуктов", value: 8 },
						{ label: "16 продуктов", value: 16 },
						{ label: "32 продуктов", value: 32 },
						{ label: "48 продуктов", value: 48 },
					]}
				/>
			</div>
		</div>
	);
}
