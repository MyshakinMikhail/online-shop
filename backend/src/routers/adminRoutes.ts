import type { Request } from "express";
import { Router } from "express";
import { User } from "../models/index.ts";
import { validateId } from "../utils/index.ts";

const router = Router();

type RequestParamsType = {
	userId: string | undefined;
};

router.get("/checkAdmin/:userId", async (req: Request<RequestParamsType, {}, {}>, res) => {
	try {
		const { userId } = req.params;

		const userIdValidationResult = validateId(userId);
		if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
			return res
				.status(400)
				.json({ message: userIdValidationResult.error || "Неверные параметры запроса" });
		}

		const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
		if (!user) {
			return res.status(404).json({ message: "Пользователя с данным id не существует" });
		}

		if (user.role === "user") {
			return res.status(403).json({ message: "Недостаточно прав" });
		}
		res.status(200).json({ message: "Данный пользователь админ" });
	} catch (error) {
		res.status(500).json({ message: "Ошибка проверки админа на сервере" });
	}
});

export default router;
