import { mockMiniProducts } from "@/entities/product/model/mocks";
import MainProductsList from "@/entities/product/ui/lists/MainProductsList/MainProductsList";
import { api } from "@/shared/api";
import type { RootState } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./ProductsPage.module.css";

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>(mockMiniProducts);
	const [isLoading, setIsLoading] = useState(false);
	const [currPage, setCurrPage] = useState(1);
	const [total, setTotal] = useState();
	const [limit, setLimit] = useState(12);
	const category = useSelector((state: RootState) => state.category.category);

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			const result = await api.get("/products", {
				params: {
					page: currPage,
					limit: limit,
					categoryId: category?.id,
				},
			});

			setIsLoading(false);
			setProducts(result.data.rows);
			setTotal(result.data.count);
		};

		fetchProducts();
	}, [category, currPage, setIsLoading, setProducts, limit]);

	if (isLoading) {
		return <div>Загрузка...</div>;
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
