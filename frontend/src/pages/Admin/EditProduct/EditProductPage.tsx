import { ProductService } from "@/entities/admin/api/ProductService";
import { updateProduct } from "@/entities/admin/model/adminProductsSlice";
import { getProductById } from "@/entities/product/api/getProductById";
import type { CreationProductType, Product } from "@/shared/types";
import { Divider, notification, Typography } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Header, ProductForm } from "../components";
import classes from "./EditProductPage.module.css";

const { Text } = Typography;

export default function EditProductPage() {
	const id = Number(useParams().id) || null;
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

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
			dispatch(updateProduct({ product: updatedProduct }));

			if (updatedProduct) {
				showCreatedProduct();
				setTimeout(() => {
					navigate("/admin/main");
				}, 3000);
			}
		} catch (error) {
			console.log("я тут");
			if (isAxiosError(error)) {
				showError(error.response?.data.message);
			} else {
				showError("Неизвестная ошибка при обновлении товара на сервер");
			}
		}
	};

	const showCreatedProduct = () => {
		api.success({
			message: "Обновление товара",
			description: "Товар успешно обновлен на сервере",
			placement: "top",
			duration: 3,
		});
	};

	const showError = (errorMessage: string) => {
		api.error({
			message: "Ошибка обновления товара",
			description: errorMessage,
			placement: "top",
			duration: 3,
		});
	};

	useEffect(() => {
		const fetchProduct = async () => {
			const product = await getProductById({ id, setIsLoading, showError });
			setProduct(product);
		};
		fetchProduct();
	}, []);

	if (isLoading) {
		return <Text>Загрузка товара..</Text>;
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
