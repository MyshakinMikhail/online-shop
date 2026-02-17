import { type Request, Router } from "express";
import { Cart, CartItem, Product, User } from "../models/index.ts";

const router = Router();

router.post("/:userId", async (req, res) => {
	try {
		let { userId } = req.params;
		const { productId } = req.body;

		if (!userId || isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры зпароса",
				error: "userId must be a number",
			});
		}

		if (!productId || isNaN(Number(productId))) {
			return res.status(400).json({
				message: "Неверные параметры зпароса",
				error: "productId must be a number",
			});
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const product = await Product.findByPk(Number(productId));
		if (!product) {
			return res.status(404).json({ message: "Товара с данным id не существует" });
		}

		const cart = await Cart.findOne({ where: { userId: user.id } });
		if (!cart) {
			return res.status(404).json({
				message:
					"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
			});
		}

		const cartItem = await CartItem.findOne({
			where: { cartId: cart.id, productId: Number(productId) },
		});

		if (cartItem) {
			return res.status(404).json({ message: "Товар уже в корзине" });
		}

		const createdCartItem = await CartItem.create({
			cartId: cart.id,
			productId: productId,
			quantity: 1,
		});
		res.status(201).json({ message: "Товар добавлен в корзину", cartItem: createdCartItem });
	} catch (e) {
		res.status(500).json({ message: "Ошибка добавления товара в корзину на сервере" });
	}
});
interface UpdateCartBody {
	productId: number;
	isIncrement: boolean;
}
interface UpdateCartParams {
	userId: string;
}
router.put("/:userId", async (req: Request<UpdateCartParams, {}, UpdateCartBody>, res) => {
	/// данные можно тут тоже типизировать !!!
	try {
		const { userId } = req.params;
		const { productId, isIncrement } = req.body;

		if (!userId || isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры зпароса",
				error: "userId must be a number",
			});
		}
		if (!productId) {
			return res.status(400).json({
				message: "Неверные параметры зпароса",
				error: "productId must be a number",
			});
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const product = await Product.findByPk(productId);
		if (!product) {
			return res.status(404).json({ message: "Товара с данным id не существует" });
		}

		const cart = await Cart.findOne({ where: { userId: user.id } });
		if (!cart) {
			return res.status(404).json({
				message:
					"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
			});
		}

		const cartItem = await CartItem.findOne({
			where: { cartId: cart.id, productId: productId },
		});
		if (!cartItem) {
			return res.status(404).json({ message: "Товар в корзине пользователя не найден" });
		}
		if (isIncrement) {
			await CartItem.update(
				{ quantity: cartItem.quantity + 1 },
				{ where: { cartId: cart.id, productId: productId } }
			);

			return res.status(200).json({
				message: "Количество товара в корзине обновлено",
				quantity: cartItem.quantity + 1,
			});
		}

		if (cartItem.quantity - 1 <= 0) {
			await CartItem.destroy({ where: { cartId: cart.id, productId: productId } });

			return res.status(200).json({
				message:
					"Количество товара в корзине меньше или равно нулю, товар удален из корзины",
			});
		}

		await CartItem.update(
			{ quantity: cartItem.quantity - 1 },
			{ where: { cartId: cart.id, productId: productId } }
		);

		return res.status(200).json({
			message: "Количество товара в корзине обновлено",
			quantity: cartItem.quantity - 1,
		});
	} catch (e) {
		res.status(500).json({
			message: "Ошибка обновления количества товара в корзине на сервере",
		});
	}
});

router.delete("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { productId } = req.body;

		if (!userId || isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры зпароса",
				error: "userId must be a number",
			});
		}
		if (!productId) {
			return res.status(400).json({
				message: "Неверные параметры зпароса",
				error: "productId must be a number",
			});
		}
		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const product = await Product.findByPk(Number(productId));
		if (!product) {
			return res.status(404).json({ message: "Товара с данным id не существует" });
		}

		const cart = await Cart.findOne({ where: { userId: user.id } });
		if (!cart) {
			return res.status(404).json({
				message:
					"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
			});
		}

		const cartItem = await CartItem.findOne({
			where: { cartId: cart.id, productId: productId },
		});
		if (!cartItem) {
			return res.status(404).json({ message: "Товар в корзине пользователя не найден" });
		}

		await CartItem.destroy({ where: { id: cartItem.id } });
		res.status(200).json({ message: "Товар успешно удален из корзины" });
	} catch (e) {
		res.status(500).json({
			message: "Ошибка удаления товара в корзине на сервере",
		});
	}
});

export default router;
