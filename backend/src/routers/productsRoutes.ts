import { Router } from "express";
import { Favorite, Product, User } from "../models/index.ts";

const router = Router();

router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { page, limit, categoryId } = req.query;

		if (isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userId must be a number",
			});
		}

		if (isNaN(Number(categoryId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "categoryId must be a number",
			});
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		const favoriteProducts = await Favorite.findAll({ where: { userId: user.id } });

		const favoriteIds = new Set(favoriteProducts.map(fav => fav.productId));

		const whereClause =
			Number(categoryId) === 1 ? undefined : { categoryId: Number(categoryId) };

		const { count, rows } = await Product.findAndCountAll({
			where: whereClause,
			limit: Number(limit) || 16,
			offset: ((Number(page) || 1) - 1) * (Number(limit) || 16),
		});

		const products = rows.map(row => {
			const product = row.get({ plain: true }); // превращает в объект без лишних полей
			return {
				...product,
				isFavorite: favoriteIds.has(product.id),
			};
		});

		res.status(200).json({ products, count });
	} catch (error) {
		res.status(500).json({ message: `Ошибка получения продуктов: ${error}` });
	}
});

export default router