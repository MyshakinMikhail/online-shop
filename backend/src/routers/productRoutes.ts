import { Router } from "express";
import { Favorite, Product, User } from "../models/index.ts";

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

router.post("/", async (req, res) => {
	try {
		// "product": {
		// 	"name": "Базовая футболка",
		// 	"description": "Классическая хлопковая футболка с круглым вырезом.",
		// 	"sizes": ["M"],
		// 	"article": "TSH-101",
		// 	"price": 1499,
		// 	"categoryId": 2,
		// 	"stock": 25
		// }

		const { product, userRole } = req.body;
		if (!userRole) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userRole is empty",
			});
		}

		if (!product) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "product is empty",
			});
		}

		if (userRole !== "admin" && userRole !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const [createdProduct, isCreated] = await Product.findOrCreate({
			where: { article: product.article },
			defaults: product,
		});

		if (!isCreated) {
			return res.status(200).json({ message: "Продукт уже создан" });
		}

		res.status(201).json({ createdProduct });
	} catch (e) {
		res.status(500).json({ message: "Ошибка создания продукта на сервере" });
	}
});

router.put("/:article", async (req, res) => {
	try {
		const { product, userRole } = req.body;
		if (!userRole) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userRole is empty",
			});
		}

		if (!product) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "product is empty",
			});
		}

		if (userRole !== "admin" && userRole !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const article = req.params.article;

		const findedProduct = await Product.findOne({ where: { article: article } });
		if (!findedProduct) {
			return res.status(404).json({
				message: "Продукта с таким артикулом нет",
			});
		}

		const updatedProduct = await Product.update(product, {
			where: { article: product.article },
		});
		res.status(200).json({ updatedProduct: updatedProduct, message: "Продукт обновлен" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка обновления продукта на сервере" });
	}
});

router.delete("/:article", async (req, res) => {
	try {
		const { userRole } = req.body;
		const { article } = req.params;
		if (!userRole) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userRole is empty",
			});
		}

		if (!article) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "article is empty" });
		}

		if (userRole !== "admin" && userRole !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const product = await Product.findOne({ where: { article: article } });
		if (!product) {
			return res.status(404).json({ message: "Продукт не найден" });
		}

		await Product.destroy({ where: { article: article } });
		res.status(200).json({ message: "Продукт успешно удален" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка удаления продукта на сервере" });
	}
});

export default router;
