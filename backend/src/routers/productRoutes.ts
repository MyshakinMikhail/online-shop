import type { Request } from "express";
import { Router } from "express";
import { v4 as uniqueArticle } from "uuid";
import { Favorite, Product, User } from "../models/index.ts";
import type { ProductAttributes, ProductCreationAttributes } from "../models/Product.ts";
import { AuthService } from "../services/index.ts";
import { validateId } from "../utils/index.ts";
import { validateProductCreationAttributes } from "../utils/validation/validation.ts";

const router = Router();

router.get("/:userId/:productId", async (req, res) => {
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

		const product = await Product.findByPk(productIdValidationResult.id);
		if (product === null) {
			return res.status(404).json({
				message: "Товар не найден",
				error: "product not found",
			});
		}

		const isFavorite = await Favorite.findOne({
			where: { userId: user.id, productId: product.id },
		});

		res.status(200).json({ product: { ...product.toJSON(), isFavorite: Boolean(isFavorite) } });
	} catch (e) {
		res.status(500).json({ message: `Ошибка получения продукта по id: ${e}` });
	}
});

router.post(
	"/:userId",
	async (req: Request<{ userId: number }, {}, { product: ProductCreationAttributes }>, res) => {
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

			const findedProduct = await Product.findOne({ where: { name: product.name } });
			if (findedProduct) {
				return res
					.status(404)
					.json({ message: "Продукт с таким названием уже существует" });
			}

			if (!AuthService.hasAdminRights(user.role)) {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}
			const article = uniqueArticle();
			const createdProduct = await Product.create({
				...productValidationResult.product,
				article: article,
			});

			res.status(201).json({ createdProduct });
		} catch (e) {
			res.status(500).json({ message: "Ошибка создания продукта на сервере" });
		}
	}
);

router.put(
	"/:userId",
	async (req: Request<{ userId: number }, {}, { product: ProductAttributes }>, res) => {
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

			const productValidationResult = validateProductCreationAttributes(product);
			if (!productValidationResult.isValid || !productValidationResult.product) {
				return res.status(400).json({
					message: productValidationResult.error || "Неверные параметры запроса",
				});
			}

			if (!AuthService.hasAdminRights(user.role)) {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}

			const findedProduct = await Product.findOne({
				where: { article: productValidationResult.product.article },
			});
			if (!findedProduct) {
				return res.status(404).json({
					message: "Продукта с таким артикулом нет",
				});
			}

			// Проверка на то, что при изменении имени продукта, он не совпадает с другим продуктом
			const findedProductByName = await Product.findOne({
				where: { name: productValidationResult.product.name },
			});
			if (findedProductByName) {
				return res.status(404).json({
					message: "Продукт с таким названием уже существует",
				});
			}

			await Product.update(productValidationResult.product, {
				where: { article: productValidationResult.product.article },
			});

			res.status(200).json({ updatedProduct: product, message: "Продукт обновлен" });
		} catch (e) {
			res.status(500).json({ message: "Ошибка обновления продукта на сервере" });
		}
	}
);

router.delete("/:userId/:productId", async (req, res) => {
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

		const product = await Product.findOne({
			where: { id: productIdValidationResult.id },
		});
		if (!product) {
			return res.status(404).json({ message: "Продукт не найден" });
		}

		await Product.destroy({ where: { id: product.id } });
		res.status(200).json({ message: "Продукт успешно удален" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка удаления продукта на сервере" });
	}
});

export default router;
