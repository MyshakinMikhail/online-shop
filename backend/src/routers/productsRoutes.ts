import { Router } from "express";
import { Product } from "../models/index.ts";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const { page, limit, categoryId } = req.query;
		if (isNaN(Number(categoryId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
			});
		}

		const whereClause =
			Number(categoryId) === 1 ? undefined : { categoryId: Number(categoryId) };

		const { count, rows } = await Product.findAndCountAll({
			where: whereClause,
			limit: Number(limit) || 16,
			offset: ((Number(page) || 1) - 1) * (Number(limit) || 16),
		});

		res.status(200).json({ rows, count });
	} catch (error) {
		res.status(500).json({ message: `Ошибка получения продуктов: ${error}` });
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

router.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		if (!id && !isNaN(Number(id))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "id is required",
			});
		}

		const product = await Product.findByPk(id);

		if (product === null) {
			return res.status(404).json({
				message: "Товар не найден",
				error: "product not found",
			});
		}
		res.status(200).json({ product });
	} catch (e) {
		res.status(500).json({ message: `Ошибка получения продукта по id: ${e}` });
	}
});

export default router;
