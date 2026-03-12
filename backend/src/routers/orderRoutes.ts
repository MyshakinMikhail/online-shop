import type { Request } from "express";
import { Router } from "express";
import sequelize from "../db.ts";
import { Cart, CartItem, Order, OrderItem, Product, User } from "../models/index.ts";
import { OrderService } from "../services/OrderService/OrderService.ts";
import { validateId } from "../utils/index.ts";

const router = Router();

type ReqParamsType = {
	userId: number;
};

type ReqBodyType = {
	userName: string;
	email: string;
	phoneNumber: string;
	promocode: string;
	city: string;
};

router.post("/:userId", async (req: Request<ReqParamsType, {}, ReqBodyType>, res) => {
	const t = await sequelize.transaction();

	try {
		const { userId } = req.params;
		const { userName, email, phoneNumber, promocode, city } = req.body;

		const userIdValidationResult = validateId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({
			where: { psuid: userIdValidationResult.id },
			transaction: t,
		});
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

		const totalPrice = OrderService.calculateOrderTotal(cart.items);
		const { finalPrice, isPromocodeActivate, sale } = OrderService.getPriceWithPromocode(
			totalPrice,
			promocode
		);

		if (userName && email && phoneNumber && promocode) {
			const order = await Order.create(
				{
					userId: user.id,
					userName: userName,
					email: email,
					phoneNumber: phoneNumber,
					promocode: promocode,
					isPromocodeActivate: isPromocodeActivate,
					sale: sale,
					city: city,
					totalPrice: finalPrice,
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
