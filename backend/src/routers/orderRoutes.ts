import { Router } from "express";
import sequelize from "../db.ts";
import { Cart, CartItem, Order, OrderItem, Product, User } from "../models/index.ts";

const router = Router();

router.post("/:userId", async (req, res) => {
	const t = await sequelize.transaction();

	try {
		const { userId } = req.params;
		const { userName, email, phoneNumber, promocode, city } = req.body;

		if (!userId || isNaN(Number(userId))) {
			res.status(400).json({
				message: "Неверные параметры запроса, userId must be a number",
			});
		}

		const user = await User.findOne({ where: { psuid: userId }, transaction: t });
		if (!user) {
			return res.status(404).json({ message: "Пользователь с данным id не найден" });
		}
		const cart = await Cart.findOne({
			where: { userId: user.id },
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
			transaction: t,
		});
		if (!cart) {
			await t.rollback();
			return res
				.status(404)
				.json({ message: "У данного пользователя не существует корзины" });
		}

		const totalPrice = cart.items.reduce((sum, item) => {
			return sum + item.quantity * item.product.price;
		}, 0);

		if (userName && email && phoneNumber && promocode) {
			const order = await Order.create(
				{
					userId: user.id,
					userName: userName,
					email: email,
					phoneNumber: phoneNumber,
					promocode: promocode,
					city: city,
					totalPrice: totalPrice,
					status: "processing",
				},
				{ transaction: t }
			);

			const orderItemsData = cart.items.map(item => ({
				orderId: order.id,
				productId: item.productId,
				quantity: item.quantity,
				priceAtPurchase: item.product!.price,
			}));

			await OrderItem.bulkCreate(orderItemsData, { transaction: t });

			await CartItem.destroy({
				where: { cartId: cart.id },
				transaction: t,
			});

			await t.commit();

			return res.json({ message: "Заказ успешно создан", orderId: order.id });
		}

		res.status(400).json({ message: "Неверные параметры в теле запроса" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения заказа пользователя" });
	}
});

export default router;
