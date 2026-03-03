import { Router, type Request } from "express";
import { Op } from "sequelize";
import { CartItem, Favorite, OrderItem, Product, User } from "../models/index.ts";

const router = Router();

type RequestParamsType = {
	userId: number;
};

type RequestQueryType = {
	page?: number;
	limit?: number;
	categoryId?: number;
	searchQuery?: string;
	isFavorites?: boolean;
};

router.delete("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(400).json({ message: "Пользователя с данным id не существует" });
		}
		if (user.role !== "admin" && user.role !== "super_admin") {
			return res
				.status(403)
				.json({ message: "Недостаточно прав для совершения данного действия" });
		}
		await Favorite.destroy({ where: {} });
		await CartItem.destroy({ where: {} });
		await OrderItem.destroy({ where: {} });
		await Product.destroy({ where: {} });

		res.status(200).json({ message: "Все продукты успешно удалнены" });
	} catch (error) {
		res.status(500).json({ message: `Ошибка удаления продукта: ${error}` });
	}
});

router.get("/:userId", async (req: Request<RequestParamsType, {}, RequestQueryType>, res) => {
	try {
		const { userId } = req.params;
		const { page, limit, categoryId, searchQuery, isFavorites } = req.query;

		if (isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userId must be a number",
			});
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		if (searchQuery != null) {
			const products = await Product.findAll({
				where: {
					[Op.or]: [
						{
							name: { [Op.iLike]: `%${searchQuery}%` },
							...(user?.role === "user" && { isActive: true }),
						},
					],
				},
			});

			return res.status(200).json({
				products: products,
				message: "Продукты по search-qyery получены успешно",
			});
		}

		const favoriteProducts = await Favorite.findAll({ where: { userId: user.id } });

		if (isFavorites) {
			const favorites = await Favorite.findAll({
				where: { userId: user.id },
				include: [{ model: Product, as: "product" }],
			});

			const products = favorites.map(fav => {
				const productData = fav.product?.get({ plain: true });
				if (productData.isActive) {
					return {
						...productData,
					};
				}
			});

			if (!products) {
				return res
					.status(404)
					.json({ message: "Избранных товаров не существует или товар не активен" });
			}
			return res.status(200).json({
				products,
				message: "Избранные продукты пользователя успешно получены",
			});
		}

		if (isNaN(Number(categoryId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "categoryId must be a number",
			});
		}

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
				...(user?.role === "user" && { isActive: true }),
			};
		});

		res.status(200).json({ products, count });
	} catch (error) {
		res.status(500).json({ message: `Ошибка получения продуктов: ${error}` });
	}
});

export default router;
