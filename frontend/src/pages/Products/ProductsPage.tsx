import { getCurrProductsByCategoryId } from "@/entities/product/model/asyncThunks";
import { setLimit, updateCurrPage } from "@/entities/product/model/productsPageSlice";
import MainProductsList from "@/entities/product/ui/lists/MainProductsList/MainProductsList";
import { ScrollContext } from "@/shared/context";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import { initStore } from "@/shared/lib/store/init";
import { Flex, Pagination, Select, Spin, Typography } from "antd";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ProductsPage.module.css";

const { Text } = Typography;

export default function ProductsPage() {
	const dispatch = useDispatch<AppDispatch>();
	const { scrollToTop } = useContext(ScrollContext);
	const { totalPages, currPage, limit, isLoading, error } = useSelector(
		(state: RootState) => state.productsPage.currProducts
	);
	const { category } = useSelector((state: RootState) => state.category);
	useEffect(() => {
		initStore();
	}, []);

	return (
		<div className={classes.container}>
			{isLoading ? <Spin className={classes.spinner} size="large" /> : null}
			{error && (
				<Flex>
					<Text>Ошибка загрузки товаров: </Text>
					<Text>{error}</Text>
				</Flex>
			)}

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
						dispatch(
							getCurrProductsByCategoryId({
								currPage: page,
								limit: limit,
								categoryId: category?.id,
							})
						);
						scrollToTop();
					}}
				/>
				<Select
					defaultValue={limit}
					style={{ width: 120 }}
					onChange={value => {
						dispatch(setLimit({ limit: value }));
						dispatch(
							getCurrProductsByCategoryId({ limit: value, categoryId: category?.id })
						);
					}}
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
