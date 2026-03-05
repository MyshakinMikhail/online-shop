import { ProductService } from "@/entities/admin/api/ProductService";
import { getProductsById } from "@/entities/product/api";
import type { CreationProductType, Product } from "@/shared/types";
import { Divider, Flex, notification, Typography } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, ProductForm } from "../components";
import classes from "./EditProductPage.module.css";

const { Text } = Typography;

export default function EditProductPage() {
	const id = Number(useParams().id) || null;
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [api, contextHolder] = notification.useNotification();
	const navigate = useNavigate();

	const handleUpdateProduct = async ({ productData }: { productData: CreationProductType }) => {
		try {
			if (!product) return;

			const productWithId: Product = {
				...productData,
				id: product.id,
			};

			const updatedProduct = await ProductService.updateProduct({ product: productWithId });
			if (updatedProduct) {
				showCreatedProduct();
				setTimeout(() => {
					navigate("/admin/main");
				}, 3000);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.message);
			} else {
				setError("Неизвестная ошибка при обновлении товара на сервер");
			}
		}
	};

	const showCreatedProduct = () => {
		api.success({
			message: "Статус товара",
			description: "Товар успешно обновлен на сервере",
			placement: "top",
			duration: 3,
		});
	};

	useEffect(() => {
		const fetchProduct = async () => {
			const product = await getProductsById({ id, setIsLoading, setError });
			setProduct(product);
		};
		fetchProduct();
	}, []);

	if (isLoading) {
		return <Text>Загрузка товара..</Text>;
	}

	if (error || !product) {
		return (
			<Flex>
				<Text> Ошибка загрузки товара: </Text>
				<Text> {error}</Text>
			</Flex>
		);
	}

	return (
		<div className={classes.page}>
			{contextHolder}
			<Header product={product} />
			<Divider size="small" />
			<ProductForm product={product} postForm={handleUpdateProduct} />
		</div>
	);
}
