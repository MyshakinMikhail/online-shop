import { type Request, Router } from "express";
import { Cart, CartItem, Product, User } from "../models/index.ts";
import { validateProductId, validateUserId } from "../utils/index.ts";

const router = Router();

router.post("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const { productId } = req.body;

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const productIdValidationResult = validateProductId(productId);
		if (!productIdValidationResult.isValid || !productIdValidationResult.productId) {
			return res.status(400).json({
				message: productIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const product = await Product.findByPk(productIdValidationResult.productId);
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
			where: { cartId: cart.id, productId: product.id },
		});

		if (cartItem) {
			return res.status(404).json({ message: "Товар уже в корзине" });
		}

		const createdCartItem = await CartItem.create({
			cartId: cart.id,
			productId: product.id,
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
	try {
		const { userId } = req.params;
		const { productId, isIncrement } = req.body;

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const productIdValidationResult = validateProductId(productId);
		if (!productIdValidationResult.isValid || !productIdValidationResult.productId) {
			return res.status(400).json({
				message: productIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const product = await Product.findByPk(productIdValidationResult.productId);
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
			where: { cartId: cart.id, productId: product.id },
		});
		if (!cartItem) {
			return res.status(404).json({ message: "Товар в корзине пользователя не найден" });
		}
		if (isIncrement) {
			await CartItem.update(
				{ quantity: cartItem.quantity + 1 },
				{ where: { cartId: cart.id, productId: product.id } }
			);

			return res.status(200).json({
				message: "Количество товара в корзине обновлено",
				quantity: cartItem.quantity + 1,
			});
		}

		if (cartItem.quantity - 1 <= 0) {
			await CartItem.destroy({ where: { cartId: cart.id, productId: product.id } });

			return res.status(200).json({
				message:
					"Количество товара в корзине меньше или равно нулю, товар удален из корзины",
			});
		}

		await CartItem.update(
			{ quantity: cartItem.quantity - 1 },
			{ where: { cartId: cart.id, productId: product.id } }
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

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const productIdValidationResult = validateProductId(productId);
		if (!productIdValidationResult.isValid || !productIdValidationResult.productId) {
			return res.status(400).json({
				message: productIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const product = await Product.findByPk(productIdValidationResult.productId);
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
			where: { cartId: cart.id, productId: product.id },
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
