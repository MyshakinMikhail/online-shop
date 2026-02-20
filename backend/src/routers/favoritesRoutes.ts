import { Router, type Request } from "express";
import { Favorite, Product, User } from "../models/index.ts";

const router = Router();

interface FavoritesParamsType {
	userId: string;
}

router.get("/:userId", async (req: Request<FavoritesParamsType>, res) => {
	try {
		const { userId } = req.params;

		if (isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "userId must be a number" });
		}
		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		const products = await Favorite.findAll({
			where: { userId: user.id },
			include: [
				{
					model: Product,
					as: "product",
				},
			],
		});
		res.status(200).json({ products });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения избранных товаров на сервере" });
	}
});

router.delete("/:userId", async (req: Request<FavoritesParamsType>, res) => {
	try {
		const { userId } = req.params;

		if (isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "userId must be a number" });
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		const products = await Favorite.findAll({ where: { userId: user.id } });
		if (!products.length) {
			return res.status(404).json({ message: "Корзина уже пустая" });
		}

		await Favorite.destroy({ where: { userId: user.id } });
		res.status(200).json({ message: "Все избранные товары успешно очищены" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка удаления всех избранных на сервере" });
	}
});

export default router;
