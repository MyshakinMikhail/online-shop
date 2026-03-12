import { ProductService } from "@/entities/admin/api/ProductService";
import { updateProduct } from "@/entities/admin/model/adminProductsSlice";
import { getProductById } from "@/entities/product/api/getProductById";
import type { CreationProductType, Product } from "@/shared/types";
import { Divider, Flex, Spin, Typography } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Header, ProductForm } from "../components";
import classes from "./EditProductPage.module.css";
import { useUpdateProductNotification } from "./hooks";

const { Text } = Typography;

export default function EditProductPage() {
	const id = Number(useParams().id) || null;
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const dispatch = useDispatch();
	const { contextHolder, showUpdatedProductNotification } = useUpdateProductNotification();
	const navigate = useNavigate();

	const handleUpdateProduct = async ({ productData }: { productData: CreationProductType }) => {
		try {
			if (!product) return;

			const productWithId: Product = {
				...productData,
				id: product.id,
			};

			const updatedProduct = await ProductService.updateProduct({ product: productWithId });
			dispatch(updateProduct({ product: updatedProduct }));

			if (updatedProduct) {
				showUpdatedProductNotification();
				setTimeout(() => {
					navigate("/admin/main");
				}, 3000);
			}
		} catch (error) {
			console.log("я тут");
			if (isAxiosError(error)) {
				setError(error.response?.data.message);
			} else {
				setError("Неизвестная ошибка при обновлении товара на сервер");
			}
		}
	};

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const product = await getProductById({ id, setIsLoading, setError });
				setProduct(product);
			} catch (error) {
				if (isAxiosError(error)) {
					setError(error.response?.data.message);
				} else {
					setError("Неизвестная ошибка при загрузке товара");
				}
			}
		};
		fetchProduct();
	}, [id, setIsLoading, setError]);

	return (
		<div className={classes.page}>
			{isLoading ? <Spin className={classes.spinner} size="large" /> : null}
			{error && (
				<Flex>
					<Text>Ошибка загрузки товара: </Text>
					<Text>{error}</Text>
				</Flex>
			)}

			{contextHolder}
			<Header product={product} />
			<Divider size="small" />
			<ProductForm product={product} postForm={handleUpdateProduct} />
		</div>
	);
}
