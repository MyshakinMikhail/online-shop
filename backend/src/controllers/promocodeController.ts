import type { Request, Response } from "express";
import { User } from "../models/index";
import { Promocode } from "../models/Promocode";
import { AuthService } from "../services/index";
import { validateId, validatePromocodeDiscount, validatePromocodeName } from "../utils/index";

interface RequestParamsType {
	userId: number;
}

interface PostRequestBodyType {
	name: string;
	isActive: boolean;
	discount: number;
}

interface PutRequestBodyType {
	id: number;
	name: string;
	discount: number;
	isActive: boolean;
}

interface DeleteRequestQueryType {
	name: string;
}

export const promocodeController = {
	addPromocode: async (
		req: Request<RequestParamsType, unknown, PostRequestBodyType>,
		res: Response
	) => {
		try {
			const { userId } = req.params;
			const { name, isActive, discount } = req.body;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			if (isActive !== undefined && typeof isActive !== "boolean") {
				return res.status(400).json({
					message: "isActive must be a boolean",
				});
			}

			const promocodeNameValidationResult = validatePromocodeName(name);
			if (!promocodeNameValidationResult.isValid || !promocodeNameValidationResult.name) {
				return res.status(400).json({
					message: promocodeNameValidationResult.error || "Неверные параметры запроса",
				});
			}
			const promocode = await Promocode.findOne({
				where: { name: promocodeNameValidationResult.name },
			});
			if (promocode) {
				return res
					.status(409)
					.json({ message: "Промокод с данным названием уже существует" });
			}

			const discountValidationResult = validatePromocodeDiscount(discount);
			if (
				!discountValidationResult.isValid ||
				discountValidationResult.discount === undefined
			) {
				return res.status(400).json({
					message: discountValidationResult.error || "Неверные параметры запроса",
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

			const existingPromocode = await Promocode.findOne({
				where: { name: promocodeNameValidationResult.name },
			});
			if (existingPromocode) {
				return res.status(409).json({ message: "Промокод уже существует" });
			}

			const createdPromocode = await Promocode.create({
				name: promocodeNameValidationResult.name,
				isActive,
				discount: discountValidationResult.discount,
			});

			res.status(201).json({
				promocode: createdPromocode,
				message: "Промокод успешно создан",
			});
		} catch (error) {
			res.status(500).json({ message: `Ошибка создания промокода: ${error}` });
		}
	},
	updatePromocode: async (
		req: Request<RequestParamsType, unknown, PutRequestBodyType>,
		res: Response
	) => {
		try {
			const { userId } = req.params;
			const { id, name, discount, isActive } = req.body;

			if (isNaN(id) || id <= 0) {
				return res.status(400).json({
					message: "Неверные параметры запроса",
					error: "id must be a positive number",
				});
			}

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const promocodeNameValidationResult = validatePromocodeName(name);
			if (!promocodeNameValidationResult.isValid || !promocodeNameValidationResult.name) {
				return res.status(400).json({
					message: promocodeNameValidationResult.error || "Неверные параметры запроса",
				});
			}

			// const promocodeWithSameName = await Promocode.findOne({
			// 	where: { name: promocodeNameValidationResult.name },
			// });
			// if (promocodeWithSameName && promocodeWithSameName.id !== Number(id)) {
			// 	return res.status(409).json({ message: "Промокод с данным названием уже существует" });
			// }

			if (isActive !== undefined && typeof isActive !== "boolean") {
				return res.status(400).json({
					message: "isActive must be a boolean",
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

			const existingPromocode = await Promocode.findOne({
				where: { id },
			});
			if (!existingPromocode) {
				return res.status(404).json({ message: "Промокод не найден" });
			}

			const discountValidationResult = validatePromocodeDiscount(discount);
			if (
				!discountValidationResult.isValid ||
				discountValidationResult.discount === undefined
			) {
				return res.status(400).json({
					message: discountValidationResult.error || "Неверные параметры запроса",
				});
			}

			await existingPromocode.update(
				{
					id,
					name: promocodeNameValidationResult.name,
					isActive: isActive ?? existingPromocode.isActive,
					discount: discountValidationResult.discount,
				},
				{ where: { id } }
			);

			res.status(200).json({
				promocode: existingPromocode,
				message: "Промокод успешно обновлен",
			});
		} catch (error) {
			res.status(500).json({ message: `Ошибка обновления промокода: ${error}` });
		}
	},
	deletePromocode: async (
		req: Request<RequestParamsType, unknown, unknown, DeleteRequestQueryType>,
		res: Response
	) => {
		try {
			const { userId } = req.params;
			const { name } = req.query;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const promocodeNameValidationResult = validatePromocodeName(name);
			if (!promocodeNameValidationResult.isValid || !promocodeNameValidationResult.name) {
				return res.status(400).json({
					message: promocodeNameValidationResult.error || "Неверные параметры запроса",
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

			const existingPromocode = await Promocode.findOne({
				where: { name: promocodeNameValidationResult.name },
			});
			if (!existingPromocode) {
				return res.status(404).json({ message: "Промокод не найден" });
			}

			await existingPromocode.destroy();

			res.status(200).json({ message: "Промокод успешно удален" });
		} catch (error) {
			res.status(500).json({ message: `Ошибка удаления промокода: ${error}` });
		}
	},
};
