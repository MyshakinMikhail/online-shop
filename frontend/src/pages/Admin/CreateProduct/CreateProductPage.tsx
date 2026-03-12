import type { CreationProductType } from "@/shared/types";
import { Divider, Flex, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductNotification } from "./hooks";
import { Header, ProductForm } from "../components";
import { ProductService } from "./../../../entities/admin/api/ProductService";
import classes from "./CreateProductPage.module.css";

const { Text } = Typography;

export const CreateProductPage = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const { contextHolder, showCreatedProductNotification } = useCreateProductNotification();

	const handleCreateProduct = async ({ productData }: { productData: CreationProductType }) => {
		try {
			const createdProduct = await ProductService.postProduct({ product: productData });

			if (createdProduct) {
				showCreatedProductNotification();
				setTimeout(() => {
					navigate("/admin/main");
				}, 3000);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.message);
			} else {
				setError("Неизвестная ошибка при добавлении товара на сервер");
			}
		}
	};

	if (error) {
		return (
			<Flex>
				<Text> Ошибка создания товара: </Text>
				<Text> {error}</Text>
			</Flex>
		);
	}

	return (
		<div className={classes.page}>
			{contextHolder}
			<Header />
			<Divider size="small" />
			<ProductForm postForm={handleCreateProduct} />
		</div>
	);
};
