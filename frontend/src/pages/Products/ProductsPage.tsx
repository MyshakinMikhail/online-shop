import { getCurrProductsByCategoryId } from "@/entities/product/model/asyncThunks";
import { setLimit, updateCurrPage } from "@/entities/product/model/productsPageSlice";
import MainProductsList from "@/entities/product/ui/lists/MainProductsList/MainProductsList";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import { Flex, Pagination, Select, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ProductsPage.module.css";

const { Text } = Typography;

export default function ProductsPage() {
	const dispatch = useDispatch<AppDispatch>();
	const { category } = useSelector((state: RootState) => state.category);
	const { totalPages, currPage, limit, isLoading, error } = useSelector(
		(state: RootState) => state.productsPage.currProducts
	);

	useEffect(() => {
		if (category?.id) {
			dispatch(
				getCurrProductsByCategoryId({
					currPage: currPage,
					limit: limit,
					categoryId: category.id,
				})
			);
		}
	}, [category?.id, currPage, limit, dispatch]);

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
			<MainProductsList />
			<div className={classes.footer}>
				<Pagination
					style={{ padding: "20px" }}
					align="center"
					pageSize={limit}
					defaultCurrent={currPage}
					total={totalPages}
					onChange={page => {
						dispatch(updateCurrPage(page));
					}}
				/>
				<Select
					defaultValue={limit}
					style={{ width: 120 }}
					onChange={value => dispatch(setLimit({ limit: value }))}
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
