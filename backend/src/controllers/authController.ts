import type { Request, Response } from "express";
import { Cart, User } from "../models/index.ts";
import { type UserAttributes } from "../models/User.ts";
import { validateId } from "../utils/validation/validation.ts";

type DoAuthRequestBodyType = {
	user: UserAttributes;
};

type DoAuthResponseType = {
	message: string;
	created: boolean;
	user?: UserAttributes;
};

type IsAithRequestParamsType = {
	psuid: string | undefined;
};

type IsAithResponseType = {
	message: string;
	user?: UserAttributes;
	found: boolean;
};

export const authController = {
	doAuth: async (
		req: Request<{}, {}, DoAuthRequestBodyType>,
		res: Response<DoAuthResponseType>
	) => {
		try {
			const userIdValidationResult = validateId(req.body?.user?.psuid);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
					created: false,
				});
			}

			const userData = req.body.user;
			// тут еще круто добавить валидацию userData

			const [user, created] = await User.findOrCreate({
				where: { psuid: userIdValidationResult.id },
				defaults: userData,
			});

			if (!created) {
				return res.status(200).json({
					message: "Пользователь уже существует в бд, авторизовали его",
					created: false,
				});
			}

			await Cart.findOrCreate({
				where: { userId: user.id },
				defaults: { userId: user.id },
			});

			return res.status(created ? 201 : 200).json({
				message: created ? "Пользователь успешно создан" : "Данные пользователя обновлены",
				user: user,
				created,
			});
		} catch (error) {
			console.error("Auth error:", error);

			return res.status(500).json({
				message: "Ошибка при сохранении пользователя",
				created: false,
			});
		}
	},

	isAuth: async (
		req: Request<IsAithRequestParamsType, {}, {}>,
		res: Response<IsAithResponseType>
	) => {
		try {
			const { psuid } = req.params;

			const userIdValidationResult = validateId(psuid);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
					found: false,
				});
			}

			// Ищем по psuid (Yandex ID), а не по id
			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });

			if (!user) {
				return res.status(404).json({
					message: "Пользователь не найден",
					found: false,
				});
			}

			res.status(200).json({
				message: "Пользователь найден",
				user: user,
				found: true,
			});
		} catch (error) {
			console.error("Error getting user:", error);
			res.status(500).json({
				message: "Ошибка получения пользователя",
				found: false,
			});
		}
	},
};
