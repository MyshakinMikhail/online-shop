import { Router, type Request } from "express";
import { Favorite, User } from "../models/index.ts";
import { validateId } from "../utils/validation/validation.ts";

const router = Router();

interface FavoriteParamsType {
	userId: string; // потому что параметры в запросе
}
interface FavoriteBodyType {
	productId: number;
}

router.post("/:userId", async (req: Request<FavoriteParamsType, {}, FavoriteBodyType>, res) => {
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

		const [createdProduct, isAdded] = await Favorite.findOrCreate({
			where: { userId: user.id, productId: productIdValidationResult.id },
			defaults: { userId: user.id, productId: productIdValidationResult.id },
		});

		if (!isAdded) {
			return res.status(200).json({ message: "Продукт уже в избранном" });
		}

		res.status(201).json({ message: "Продукт добавлен в избранное" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка добавления товара в избранное" });
	}
});
router.delete("/:userId", async (req: Request<FavoriteParamsType, {}, FavoriteBodyType>, res) => {
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

		const product = await Favorite.findOne({
			where: { userId: user.id, productId: productIdValidationResult.id },
		});

		if (!product) {
			return res.status(404).json({ message: "Данного товара уже нет в корзине" });
		}

		await Favorite.destroy({ where: { userId: user.id, productId: product.id } });
		res.status(200).json({ message: "Товар удален из избранного" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка удаления избранного товара" });
	}
});

export default router;
