import type { Request, Response } from "express";
import { type CartAttributes } from "../models/Cart.ts";
import { Cart, CartItem, Product, User } from "../models/index.ts";
import { validateId } from "../utils/index.ts";

type GetCartRequestParamsType = {
	userId: number;
};

type GetCartResponseType = {
	cart?: CartAttributes;
	message: string;
};

type DeleteCartRequestParamsType = {
	userId: number;
};

type DeleteCartResponseType = {
	message: string;
	isDeleted: boolean;
};

export const cartConteroller = {
	getCart: async (req: Request<GetCartRequestParamsType>, res: Response<GetCartResponseType>) => {
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
				return res.status(404).json({ message: "Пользователя с таким id не существует" });
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
			});
			if (!cart) {
				return res.status(404).json({ message: "Корзины не существует" });
			}

			res.status(200).json({ message: "Корзина получена успешно", cart });
		} catch (e) {
			res.status(500).json({ message: "Ошибка получения корзины пользователя на сервере" });
		}
	},
	deleteCart: async (
		req: Request<DeleteCartRequestParamsType>,
		res: Response<DeleteCartResponseType>
	) => {
		try {
			const { userId } = req.params;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
					isDeleted: false,
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res
					.status(404)
					.json({ message: "Пользователя с таким id не существует", isDeleted: false });
			}

			const cart = await Cart.findOne({ where: { userId: user.id } });
			if (!cart) {
				return res.status(404).json({
					message:
						"У данного пользователя не существует корзины, ошибка создания корзины на сервере при создании пользователя",
					isDeleted: false,
				});
			}

			const itemsCount = await CartItem.count({
				where: { cartId: cart.id },
			});

			if (itemsCount === 0) {
				return res.status(404).json({ message: "Корзина уже пустая", isDeleted: false });
			}

			await CartItem.destroy({
				where: { cartId: cart.id },
			});

			res.status(200).json({
				message: "Товары успешно удалены из корзины",
				isDeleted: true,
			});
		} catch (e) {
			res.status(500).json({
				message: "Ошибка удаления корзины пользователя на сервере",
				isDeleted: false,
			});
		}
	},
};
