import type { Request, Response } from "express";
import { v4 as uniqueArticle } from "uuid";
import { User } from "../models/index.ts";
import type { ProductAttributes, ProductCreationAttributes } from "../models/Product.ts";
import { AuthService, FavoriteService, ProductService } from "../services/index.ts";
import { validateId } from "../utils/index.ts";
import {
	validateProductCreationAttributes,
	validateProductUpdateAttributes,
} from "../utils/validation/validation.ts";

export const productController = {
	getProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId } = req.params;

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
				return res.status(404).json({ message: "Данного пользователя не существует" });
			}

			const product = await ProductService.getProduct(productIdValidationResult.id);
			if (product === null) {
				return res.status(404).json({
					message: "Товар не найден",
					error: "product not found",
				});
			}

			const isFavorite = await FavoriteService.getFavorite(user.id, product.id);

			res.status(200).json({
				product: { ...product.toJSON(), isFavorite: Boolean(isFavorite) },
			});
		} catch (e) {
			res.status(500).json({ message: `Ошибка получения продукта по id: ${e}` });
		}
	},
	addProduct: async (
		req: Request<{ userId: number }, {}, { product: ProductCreationAttributes }>,
		res: Response
	) => {
		try {
			const { userId } = req.params;
			const { product } = req.body;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(400).json({ message: "Пользователя с данным id не существует" });
			}

			const productValidationResult = validateProductCreationAttributes(product);
			if (!productValidationResult.isValid || !productValidationResult.product) {
				return res.status(400).json({
					message: productValidationResult.error || "Неверные параметры запроса",
				});
			}

			const findedProduct = await ProductService.getProductByName(product.name);
			if (findedProduct) {
				return res
					.status(404)
					.json({ message: "Продукт с таким названием уже существует" });
			}

			if (!AuthService.hasAdminRights(user.role)) {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}

			const article = uniqueArticle();
			const finalProduct = { ...product, article };

			const createdProduct = await ProductService.createProduct(finalProduct);

			res.status(201).json({ createdProduct });
		} catch (e) {
			res.status(500).json({ message: "Ошибка создания продукта на сервере" });
		}
	},
	updateProduct: async (
		req: Request<{ userId: number }, {}, { product: ProductAttributes }>,
		res: Response
	) => {
		try {
			const { userId } = req.params;
			const { product } = req.body;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(400).json({ message: "Пользователь с данным id не существует" });
			}

			const productValidationResult = validateProductUpdateAttributes(product);
			if (!productValidationResult.isValid || !productValidationResult.product) {
				return res.status(400).json({
					message: productValidationResult.error || "Неверные параметры запроса",
				});
			}

			if (!AuthService.hasAdminRights(user.role)) {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}

			const findedProduct = await ProductService.getProductByArticle(
				productValidationResult.product.article
			);
			if (!findedProduct) {
				return res.status(404).json({
					message: "Продукта с таким артикулом нет",
				});
			}
			// Проверка на то, что при изменении имени продукта, он не совпадает с другим продуктом
			const findedProductByName = await ProductService.getProductByName(
				productValidationResult.product.name
			);
			if (findedProductByName && findedProductByName.id !== product.id) {
				return res.status(404).json({
					message: "Продукт с таким названием уже существует",
				});
			}

			await ProductService.updateProduct(productValidationResult.product);

			res.status(200).json({ updatedProduct: product, message: "Продукт обновлен" });
		} catch (e) {
			res.status(500).json({ message: "Ошибка обновления продукта на сервере" });
		}
	},
	deleteProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId } = req.params;

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

			if (!AuthService.hasAdminRights(user.role)) {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}

			const product = await ProductService.getProduct(productIdValidationResult.id);

			if (!product) {
				return res.status(404).json({ message: "Продукт не найден" });
			}

			await ProductService.deleteProduct(product.id);
			res.status(200).json({ message: "Продукт успешно удален" });
		} catch (e) {
			res.status(500).json({ message: "Ошибка удаления продукта на сервере" });
		}
	},
};
