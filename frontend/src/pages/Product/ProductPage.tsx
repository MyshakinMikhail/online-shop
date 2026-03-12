import { CartServise } from "@/entities/cart/api/CartServise";
import { getCartProducts } from "@/entities/cart/model/asyncThunks";
import { addCartProduct, incrementCartProductQuantity } from "@/entities/cart/model/slice";
import { FavoriteProductsService } from "@/entities/favorites/api/FavoriteProductsService";
import { getFavoriteProducts } from "@/entities/favorites/model/asyncThunks";
import { updateFavorites } from "@/entities/favorites/model/favoriteSlice";
import { getProductById } from "@/entities/product/api/getProductById";
import { addFavoriteItem, deleteFavoriteItem } from "@/entities/product/model/productsPageSlice";
import type { AppDispatch, RootState } from "@/shared/lib/store";
import type { Product } from "@/shared/types";
import { HeartIcon, MyButton } from "@/shared/ui";
import { Header } from "@/widgets/Header";
import { Flex, Spin, Typography } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useProductNotifications } from "./hooks";
import classes from "./ProductPage.module.css";

const { Title, Text } = Typography;

export default function ProductPage() {
	const id = Number(useParams().id) || null;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const dispatch = useDispatch<AppDispatch>();
	const [product, setProduct] = useState<Product | null>(null);
	const { products } = useSelector((state: RootState) => state.cart);
	const {
		contextHolder,
		showAddFavoriteProductNotification,
		showDeleteFavoriteProductNotification,
		showUpdateCartNotification,
	} = useProductNotifications();

	useEffect(() => {
		const fetchProduct = async () => {
			const product = await getProductById({ id, setIsLoading, setError });
			setProduct(product);
		};

		fetchProduct();
		dispatch(getCartProducts());
		dispatch(getFavoriteProducts());
	}, [id]);

	const handleAddInCart = async () => {
		try {
			if (product) {
				if (products.find(cartProduct => cartProduct.id === product.id)) {
					await CartServise.updateQuantity(product.id, true);
					dispatch(incrementCartProductQuantity({ productId: product.id }));
				} else {
					await CartServise.addProduct(product.id);
					dispatch(addCartProduct(product));
				}
				showUpdateCartNotification(product.name);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.response?.data.message);
			} else {
				setError("Неизвестная ошибка при добавлении товара в корзину");
			}
		}
	};

	const handleIconClick = async () => {
		try {
			if (product && !product?.isFavorite) {
				dispatch(addFavoriteItem(product.id));
				dispatch(updateFavorites({ product }));
				FavoriteProductsService.addFavoriteProduct(product.id);
				setProduct(prevProduct =>
					prevProduct ? { ...prevProduct, isFavorite: true } : null
				);
				showAddFavoriteProductNotification();
			} else if (product) {
				dispatch(deleteFavoriteItem(product.id));
				dispatch(updateFavorites({ product }));
				FavoriteProductsService.deleteFavoriteProduct(product.id);
				setProduct(prevProduct =>
					prevProduct ? { ...prevProduct, isFavorite: false } : null
				);
				showDeleteFavoriteProductNotification();
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError(error.response?.data.message);
			} else {
				setError("Неизвестная ошибка при добавлении товара в избранное");
			}
		}
	};

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
