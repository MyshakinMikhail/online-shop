import type { Request } from "express";
import { Router } from "express";
import { User } from "../models/index.ts";
import { Promocode } from "../models/Promocode.ts";
import { AuthService } from "../services/index.ts";
import { validatePromocode, validatePromocodeDiscount, validateUserId } from "../utils/index.ts";

const router = Router();

type RequestParamsType = {
	userId: number;
};

type RequestBodyType = {
	promocode: string;
	discount?: number;
	isActive?: boolean;
};

router.post("/:userId", async (req: Request<RequestParamsType, {}, RequestBodyType>, res) => {
	try {
		const { userId } = req.params;
		const { promocode, discount } = req.body;

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const promocodeValidationResult = validatePromocode(promocode);
		if (!promocodeValidationResult.isValid || !promocodeValidationResult.promocode) {
			return res.status(400).json({
				message: promocodeValidationResult.error || "Неверные параметры запроса",
			});
		}
		const discountValidationResult = validatePromocodeDiscount(discount);
		if (!discountValidationResult.isValid || discountValidationResult.discount === undefined) {
			return res.status(400).json({
				message: discountValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
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
			where: { promocode: promocodeValidationResult.promocode },
		});
		if (existingPromocode) {
			return res.status(409).json({ message: "Промокод уже существует" });
		}

		const createdPromocode = await Promocode.create({
			promocode: promocodeValidationResult.promocode,
			isActive: true,
			discount: discountValidationResult.discount,
		});

		res.status(201).json({ createdPromocode, message: "Промокод успешно создан" });
	} catch (error) {
		res.status(500).json({ message: `Ошибка создания промокода: ${error}` });
	}
});

router.put("/:userId", async (req: Request<RequestParamsType, {}, RequestBodyType>, res) => {
	try {
		const { userId } = req.params;
		const { promocode, discount, isActive } = req.body;

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const promocodeValidationResult = validatePromocode(promocode);
		if (!promocodeValidationResult.isValid || !promocodeValidationResult.promocode) {
			return res.status(400).json({
				message: promocodeValidationResult.error || "Неверные параметры запроса",
			});
		}

		if (isActive !== undefined && typeof isActive !== "boolean") {
			return res.status(400).json({
				message: "isActive must be a boolean",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
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
			where: { promocode: promocodeValidationResult.promocode },
		});
		if (!existingPromocode) {
			return res.status(404).json({ message: "Промокод не найден" });
		}

		const discountValidationResult = validatePromocodeDiscount(discount);
		if (!discountValidationResult.isValid || discountValidationResult.discount === undefined) {
			return res.status(400).json({
				message: discountValidationResult.error || "Неверные параметры запроса",
			});
		}

		await existingPromocode.update({
			promocode: promocodeValidationResult.promocode,
			isActive: isActive ?? existingPromocode.isActive,
			discount: discountValidationResult.discount,
		});

		res.status(200).json({
			updatedPromocode: existingPromocode,
			message: "Промокод успешно обновлен",
		});
	} catch (error) {
		res.status(500).json({ message: `Ошибка обновления промокода: ${error}` });
	}
});

router.delete(
	"/:userId",
	async (req: Request<RequestParamsType, {}, Pick<RequestBodyType, "promocode">>, res) => {
		try {
			const { userId } = req.params;
			const { promocode } = req.body;

			const userIdValidationResult = validateUserId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const promocodeValidationResult = validatePromocode(promocode);
			if (!promocodeValidationResult.isValid || !promocodeValidationResult.promocode) {
				return res.status(400).json({
					message: promocodeValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
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
				where: { promocode: promocodeValidationResult.promocode },
			});
			if (!existingPromocode) {
				return res.status(404).json({ message: "Промокод не найден" });
			}

			await existingPromocode.destroy();

			res.status(200).json({ message: "Промокод успешно удален" });
		} catch (error) {
			res.status(500).json({ message: `Ошибка удаления промокода: ${error}` });
		}
	}
);

export default router;
