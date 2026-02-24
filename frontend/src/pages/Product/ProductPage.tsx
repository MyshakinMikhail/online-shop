import { getCartProducts } from "@/entities/cart/model/asyncThunks";
import { addProduct } from "@/entities/cart/model/slice";
import { FavoriteProductsService } from "@/entities/favorites/api/FavoriteProductsService";
import { getFavoriteProducts } from "@/entities/favorites/model/asyncThunks";
import { updateFavorites } from "@/entities/favorites/model/favoriteSlice";
import { getProductsById } from "@/entities/product/api";
import { addFavoriteItem, deleteFavoriteItem } from "@/entities/product/model/productsPageSlice";
import type { AppDispatch } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { HeartIcon, MyButton } from "@/shared/ui";
import { Header } from "@/widgets/Header";
import { Flex, notification, Typography } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import classes from "./ProductPage.module.css";

const { Title, Text } = Typography;

export default function ProductPage() {
	const id = Number(useParams().id) || null;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const dispatch = useDispatch<AppDispatch>();
	const [product, setProduct] = useState<Product | null>(null);

	const [api, contextHolder] = notification.useNotification();
	const openFavoritesNotification = (placement: NotificationPlacement, newStatus: boolean) => {
		api.success({
			message: `Обновление избранных товаров`,
			description: newStatus
				? "Товар успешно добавлен в избранное"
				: "Товар удален из избранного",
			placement,
			duration: 3,
		});
	};

	const openCartNotification = (placement: NotificationPlacement) => {
		api.success({
			message: "Обновление корзины",
			description: `"${product?.name}" добавлен в корзину`,
			placement,
			duration: 3,
		});
	};

	useEffect(() => {
		const fetchProduct = async () => {
			const product = await getProductsById({ id, setIsLoading, setError });
			setProduct(product);
		};

		fetchProduct();
		dispatch(getCartProducts());
		dispatch(getFavoriteProducts());
	}, [id]);

	const handleAddInCart = () => {
		if (product) {
			dispatch(addProduct(product));
			openCartNotification("top");
		}
	};

	const handleIconClick = async () => {
		if (product && !product?.isFavorite) {
			dispatch(addFavoriteItem(product.id));
			dispatch(updateFavorites({ product }));
			FavoriteProductsService.addFavoriteProduct(product.id);
			setProduct(prevProduct => (prevProduct ? { ...prevProduct, isFavorite: true } : null));
		} else if (product) {
			dispatch(deleteFavoriteItem(product.id));
			dispatch(updateFavorites({ product }));
			FavoriteProductsService.deleteFavoriteProduct(product.id);
			setProduct(prevProduct => (prevProduct ? { ...prevProduct, isFavorite: false } : null));
		}
		openFavoritesNotification("top", !product?.isFavorite);
	};

	if (isLoading) {
		return <Text>Загрузка товара..</Text>;
	}

	if (error) {
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
			<Header />
			<Flex className={classes.body}>
				<Flex className={classes.images}>
					<img
						src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
						width="530px"
						height="auto"
						style={{ borderRadius: "10px" }}
					/>
					<img
						src="https://static.tildacdn.com/stor3435-3861-4835-b432-323134376130/56150826.jpg"
						width="530px"
						height="auto"
						style={{ borderRadius: "10px" }}
					/>
				</Flex>
				<Flex className={classes.description} vertical gap={15}>
					<Title level={3}>{product?.name}</Title>
					<Text>Артикул: {product?.article}</Text>
					<Text>Цена: {product?.price} руб.</Text>
					<Text>Описание: {product?.description}</Text>
					{product?.stock === 0 ? (
						<Text type="danger">Данного товара нет в наличии</Text>
					) : (
						<Text>В наличии: {product?.stock} штук</Text>
					)}
					<Flex align="center" justify="center" gap={15}>
						<MyButton label="Добавить в корзину" onClick={handleAddInCart} />
						<HeartIcon isFavorite={product?.isFavorite} onClick={handleIconClick} />
					</Flex>
				</Flex>
			</Flex>
		</div>
	);
}
