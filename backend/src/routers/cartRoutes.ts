import { Router } from "express";
import { Cart, CartItem, Product, User } from "../models/index.ts";

const router = Router();

router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId || isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "userId must be a number" });
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: "Пользователя с таким id не существует" });
		}

		const cart = await Cart.findOne({
			where: { userId: Number(userId) },
			include: [
				{
					model: CartItem,
					as: "items",
					include: [
						{
							model: Product,
							as: "product",
						},
					],
				},
			],
		});

		res.status(200).json({ cart });
	} catch (e) {
		res.status(500).json({ message: "Ошибка получения корзины пользователя на сервере" });
	}
});

router.delete("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		if (!userId || isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "userId must be a number" });
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: "Пользователя с таким id не существует" });
		}

		const cart = await Cart.findOne({ where: { userId: userId } });
		if (!cart) {
			return res.status(404).json({
				message:
					"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
			});
		}

		const itemsCount = await CartItem.count({
			where: { cartId: cart.id },
		});

		if (itemsCount === 0) {
			return res.status(404).json({ message: "Корзина уже пустая" });
		}

		await CartItem.destroy({
			where: { cartId: cart.id },
		});
		res.status(200).json({ message: "Товары успешно удалены из корзины" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка удаления корзины пользователя на сервере" });
	}
});

export default router;
