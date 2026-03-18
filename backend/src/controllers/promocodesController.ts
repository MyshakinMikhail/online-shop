import type { Request, Response } from "express";
import { Op } from "sequelize";
import { User } from "../models/index.ts";
import { Promocode } from "../models/Promocode.ts";
import { AuthService } from "../services/index.ts";
import { validateId } from "../utils/index.ts";

type RequestParamsType = {
	userId: number;
};
type RequestQueryType = {
	searchQuery: string;
};

export const promocodesController = {
	getAllPromocodes: async (
		req: Request<RequestParamsType, {}, {}, RequestQueryType>,
		res: Response
	) => {
		try {
			const { userId } = req.params;
			const { searchQuery } = req.query;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(404).json({ message: "Пользователя с данным id не существует" });
			}

			const isAdmin = AuthService.hasAdminRights(user.role);
			if (!isAdmin) {
				return res
					.status(403)
					.json({ message: "Недостаточно прав для совершения данного действия" });
			}

			const promocodes = await Promocode.findAll({
				where: {
					name: { [Op.iLike]: `%${searchQuery}%` },
				},
				order: [["name", "ASC"]],
			});

			return res
				.status(200)
				.json({ promocodes: promocodes, message: "Промокоды успешно получены" });
		} catch (error) {
			res.status(500).json({ message: `Ошибка получения промокодов: ${error}` });
		}
	},
	deleteAllPromocodes: async (req: Request<RequestParamsType>, res: Response) => {
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
				return res.status(404).json({ message: "Пользователя с данным id не существует" });
			}

			const isAdmin = AuthService.hasAdminRights(user.role);
			if (!isAdmin) {
				return res
					.status(403)
					.json({ message: "Недостаточно прав для совершения данного действия" });
			}

			await Promocode.destroy({ where: {} });
			return res.status(200).json({ message: "Промокоды успешно удалены" });
		} catch (error) {
			res.status(500).json({ message: `Ошибка удаления промокодов: ${error}` });
		}
	},
};
