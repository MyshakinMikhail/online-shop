import { Router, type Request } from "express";
import { User } from "../models/index.ts";
import { Promocode } from "../models/Promocode.ts";
import { AuthService } from "../services/index.ts";
import { validateUserId } from "../utils/index.ts";

const router = Router();

type RequestParamsType = {
	userId: number;
};

router.get("/:userId", async (req: Request<RequestParamsType>, res) => {
	try {
		const { userId } = req.params;

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
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

		const promocodes = await Promocode.findAll({ where: {} });
		return res.status(200).json({ promocodes, message: "Промокоды успешно получены" });
	} catch (error) {
		res.status(500).json({ message: `Ошибка получения промокодов: ${error}` });
	}
});
router.delete("/:userId", async (req: Request<RequestParamsType>, res) => {
	try {
		const { userId } = req.params;

		const userIdValidationResult = validateUserId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.userId) {
			return res.status(400).json({
				message: userIdValidationResult.error || "Неверные параметры запроса",
			});
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.userId } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		const isAdmin = AuthService.hasAdminRights(user.role);
		if (!isAdmin) {
			return res.status(403).json({ message: "Недостаточно прав для совершения данного действия" });
		}

		await Promocode.destroy({ where: {} });
		return res.status(200).json({ message: "Промокоды успешно удалены" });
	} catch (error) {
		res.status(500).json({ message: `Ошибка удаления промокодов: ${error}` });
	}
});

export default router;
