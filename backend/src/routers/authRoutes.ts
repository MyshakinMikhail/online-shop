import { Router, type Request } from "express";
import { Cart, User } from "../models/index.ts";
import { type UserAttributes } from "../models/User.ts";
import { validateId } from "../utils/validation/validation.ts";

const router = Router();

type PostRequestBodyType = {
	user: UserAttributes;
};

router.post("/yandex", async (req: Request<{}, {}, PostRequestBodyType>, res) => {
	try {
		const userIdValidationResult = validateId(req.body?.user?.psuid);
		if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
			return res
				.status(400)
				.json({ message: userIdValidationResult.error || "Неверные параметры запроса" });
		}

		const userData = req.body.user;

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
		});
	}
});

type RequestParamsType = {
	psuid: string | undefined;
};
// Простой endpoint для проверки существования пользователя
// НЕ создает пользователя, только проверяет
router.get("/checkUser/:psuid", async (req: Request<RequestParamsType, {}, {}>, res) => {
	try {
		const { psuid } = req.params;

		const userIdValidationResult = validateId(psuid);
		if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
			return res
				.status(400)
				.json({ message: userIdValidationResult.error || "Неверные параметры запроса" });
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
			user: {
				id: user.id,
				psuid: user.psuid,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.default_email,
			},
			found: true,
		});
	} catch (error) {
		console.error("Error getting user:", error);
		res.status(500).json({
			message: "Ошибка получения пользователя",
		});
	}
});

export default router;
