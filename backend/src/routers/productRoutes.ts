import type { Request } from "express";
import { Router } from "express";
import { v4 as uniqueArticle } from "uuid";
import { Favorite, Product, User } from "../models/index.ts";
import type { ProductAttributes, ProductCreationAttributes } from "../models/Product.ts";

const router = Router();

router.get("/:userId/:id", async (req, res) => {
	try {
		const { userId, id } = req.params;
		if (!id && !isNaN(Number(id))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "id is required",
			});
		}
		if (!userId && !isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userId is required",
			});
		}
		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		const product = await Product.findByPk(id);
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

			if (!userId || isNaN(Number(userId))) {
				return res.status(400).json({
					message: "Неверные параметры запроса",
					error: "userId is empty",
				});
			}

			const user = await User.findOne({ where: { psuid: userId } });
			if (!user) {
				return res.status(400).json({ message: "Пользователя с данным id не существует" });
			}

			if (!product) {
				return res.status(400).json({
					message: "Неверные параметры запроса",
					error: "product is empty",
				});
			}

			if (user.role !== "admin" && user.role !== "super_admin") {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}
			const article = uniqueArticle();
			const createdProduct = await Product.create({
				...product,
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

			if (!userId || isNaN(Number(userId))) {
				return res.status(400).json({
					message: "Неверные параметры запроса",
					error: "userId is empty",
				});
			}

			const user = await User.findOne({ where: { psuid: userId } });
			if (!user) {
				return res.status(400).json({ message: "Пользователь с данным id не существует" });
			}

			if (!product) {
				return res.status(400).json({
					message: "Неверные параметры запроса",
					error: "product is empty",
				});
			}

			if (user.role !== "admin" && user.role !== "super_admin") {
				return res.status(403).json({ message: "Недостаточно прав для данного действия" });
			}

			const findedProduct = await Product.findOne({ where: { article: product.article } });
			if (!findedProduct) {
				return res.status(404).json({
					message: "Продукта с таким артикулом нет",
				});
			}

			await Product.update(product, {
				where: { article: product.article },
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

		if (!userId) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userId is empty",
			});
		}

		if (!productId) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "productId is empty" });
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		if (user.role !== "admin" && user.role !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const product = await Product.findOne({ where: { id: productId } });
		if (!product) {
			return res.status(404).json({ message: "Продукт не найден" });
		}

		await Product.destroy({ where: { id: productId } });
		res.status(200).json({ message: "Продукт успешно удален" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка удаления продукта на сервере" });
	}
});

export default router;
