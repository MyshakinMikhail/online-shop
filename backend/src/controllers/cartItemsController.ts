import type { Request, Response } from "express";
import { type CartItemAttributes } from "../models/CartItem.ts";
import { Cart, CartItem, User } from "../models/index.ts";
import { ProductService } from "../services/index.ts";
import { validateId } from "../utils/index.ts";

type AddProductRequestType = {
	userId: number;
	productId: number;
};

type AddProductResposeType = {
	message: string;
	cartItem?: CartItemAttributes;
};

type UpdateCartRequestBodyType = {
	productId: number;
	isIncrement: boolean;
};
type UpdateCartRequestParamsType = {
	userId: string;
};

type UpdateCartResponseType = {
	message: string;
	quantity?: number;
};

type DeleteProductRequestParamsType = {
	userId: number;
};

type DeleteProductRequestBodyType = {
	productId: number;
};

type DeleteProductResponseType = {
	message: string;
	isDeleted: boolean;
};

export const cartItemsController = {
	addProduct: async (
		req: Request<AddProductRequestType>,
		res: Response<AddProductResposeType>
	) => {
		try {
			const { userId } = req.params;
			const { productId } = req.body;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const productIdValidationResult = validateId(productId);
			if (!productIdValidationResult.isValid || !productIdValidationResult.id) {
				return res.status(400).json({
					message: productIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(404).json({ message: "Пользователя с данным id не существует" });
			}

			const product = await ProductService.getProduct(productIdValidationResult.id);
			if (!product) {
				return res.status(404).json({ message: "Товара с данным id не существует" });
			}

			const cart = await Cart.findOne({ where: { userId: user.id } });
			if (!cart) {
				return res.status(404).json({
					message:
						"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
				});
			}

			const cartItem = await CartItem.findOne({
				where: { cartId: cart.id, productId: product.id },
			});

			if (cartItem) {
				return res.status(404).json({ message: "Товар уже в корзине" });
			}

			const createdCartItem = await CartItem.create({
				cartId: cart.id,
				productId: product.id,
				quantity: 1,
			});
			res.status(201).json({
				message: "Товар добавлен в корзину",
				cartItem: createdCartItem,
			});
		} catch (e) {
			res.status(500).json({ message: "Ошибка добавления товара в корзину на сервере" });
		}
	},
	updateProduct: async (
		req: Request<UpdateCartRequestParamsType, {}, UpdateCartRequestBodyType>,
		res: Response<UpdateCartResponseType>
	) => {
		try {
			const { userId } = req.params;
			const { productId, isIncrement } = req.body;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const productIdValidationResult = validateId(productId);
			if (!productIdValidationResult.isValid || !productIdValidationResult.id) {
				return res.status(400).json({
					message: productIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(404).json({ message: "Пользователя с данным id не существует" });
			}

			const product = await ProductService.getProduct(productIdValidationResult.id);
			if (!product) {
				return res.status(404).json({ message: "Товара с данным id не существует" });
			}

			const cart = await Cart.findOne({ where: { userId: user.id } });
			if (!cart) {
				return res.status(404).json({
					message:
						"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
				});
			}

			const cartItem = await CartItem.findOne({
				where: { cartId: cart.id, productId: product.id },
			});
			if (!cartItem) {
				return res.status(404).json({ message: "Товар в корзине пользователя не найден" });
			}
			if (isIncrement) {
				await CartItem.update(
					{ quantity: cartItem.quantity + 1 },
					{ where: { cartId: cart.id, productId: product.id } }
				);

				return res.status(200).json({
					message: "Количество товара в корзине обновлено",
					quantity: cartItem.quantity + 1,
				});
			}

			if (cartItem.quantity - 1 <= 0) {
				await CartItem.destroy({ where: { cartId: cart.id, productId: product.id } });

				return res.status(200).json({
					message:
						"Количество товара в корзине меньше или равно нулю, товар удален из корзины",
				});
			}

			await CartItem.update(
				{ quantity: cartItem.quantity - 1 },
				{ where: { cartId: cart.id, productId: product.id } }
			);

			return res.status(200).json({
				message: "Количество товара в корзине обновлено",
				quantity: cartItem.quantity - 1,
			});
		} catch (e) {
			res.status(500).json({
				message: "Ошибка обновления количества товара в корзине на сервере",
			});
		}
	},
	deleteProduct: async (
		req: Request<DeleteProductRequestParamsType, {}, DeleteProductRequestBodyType>,
		res: Response<DeleteProductResponseType>
	) => {
		try {
			const { userId } = req.params;
			const { productId } = req.body;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
					isDeleted: false,
				});
			}

			const productIdValidationResult = validateId(productId);
			if (!productIdValidationResult.isValid || !productIdValidationResult.id) {
				return res.status(400).json({
					message: productIdValidationResult.error || "Неверные параметры запроса",
					isDeleted: false,
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res
					.status(404)
					.json({ message: "Пользователя с данным id не существует", isDeleted: false });
			}

			const product = await ProductService.getProduct(productIdValidationResult.id);
			if (!product) {
				return res
					.status(404)
					.json({ message: "Товара с данным id не существует", isDeleted: false });
			}

			const cart = await Cart.findOne({ where: { userId: user.id } });
			if (!cart) {
				return res.status(404).json({
					message:
						"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
					isDeleted: false,
				});
			}

			const cartItem = await CartItem.findOne({
				where: { cartId: cart.id, productId: product.id },
			});
			if (!cartItem) {
				return res
					.status(404)
					.json({ message: "Товар в корзине пользователя не найден", isDeleted: false });
			}

			await CartItem.destroy({ where: { id: cartItem.id } });
			res.status(200).json({ message: "Товар успешно удален из корзины", isDeleted: true });
		} catch (e) {
			res.status(500).json({
				message: "Ошибка удаления товара в корзине на сервере",
				isDeleted: false,
			});
		}
	},
};
