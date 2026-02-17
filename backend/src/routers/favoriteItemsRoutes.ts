import { Router, type Request } from "express";
import { Favorite } from "../models/index.ts";

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

		if (isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "userId must be a number" });
		}

		if (!productId) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "productId must be a number",
			});
		}

		const [createdProduct, isAdded] = await Favorite.findOrCreate({
			where: { userId: Number(userId), productId: productId },
			defaults: { userId: Number(userId), productId: productId },
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

		if (isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "userId must be a number" });
		}

		if (!productId) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "productId must be a number",
			});
		}
		const product = await Favorite.findOne({
			where: { userId: Number(userId), productId: productId },
		});

		if (!product) {
			return res.status(404).json({ message: "Данного товара уже нет в корзине" });
		}

		await Favorite.destroy({ where: { userId: Number(userId), productId: productId } });
		res.status(200).json({ message: "Товар удален из избранного" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка удаления избранного товара" });
	}
});

export default router;
