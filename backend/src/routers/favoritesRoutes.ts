import { Router, type Request } from "express";
import { User } from "../models/index.ts";
import { FavoriteService } from "../services/index.ts";
import { validateId } from "../utils/index.ts";

const router = Router();

interface FavoritesParamsType {
	userId: string;
}

router.get("/:userId", async (req: Request<FavoritesParamsType>, res) => {
	try {
		const { userId } = req.params;

		const userIdValidationResult = validateId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		const products = await FavoriteService.getAllFavoritesWithProducts(user.id);

		res.status(200).json({ products });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения избранных товаров на сервере" });
	}
});

router.delete("/:userId", async (req: Request<FavoritesParamsType>, res) => {
	try {
		const { userId } = req.params;

		const userIdValidationResult = validateId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}

		const products = await FavoriteService.getAllUserFavorites(user.id);
		if (!products.length) {
			return res.status(404).json({ message: "Корзина уже пустая" });
		}

		await FavoriteService.deleteAllUserFavorites(user.id);
		res.status(200).json({ message: "Все избранные товары успешно очищены" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка удаления всех избранных на сервере" });
	}
});

export default router;
