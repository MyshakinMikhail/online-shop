import { Router, type Request } from "express";
import { User } from "../models/index.ts";

const router = Router();

type RequestParamsType = {
	userId: string;
};
type RequestBodyType = {
	login: string;
	password: string;
};

router.post("/login/:userId", async (req: Request<RequestParamsType, {}, RequestBodyType>, res) => {
	try {
		const { userId } = req.params;
		const { login, password } = req.body;

		if (!userId || isNaN(Number(userId))) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса, userId must be a number" });
		}

		const user = await User.findOne({ where: { psuid: userId } });
		if (!user) {
			return res.status(404).json({ message: "Данного пользователя не существует" });
		}
		
		if (user.role !== "admin" && user.role !== "super_admin") {
			return res.status(403).json({ message: "У вас недостаточно прав для авторизации" });
		}

		if (!login || !password) {
			return res.status(400).json({ message: "Неверные параметры запроса" });
		}

		if (login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD) {
			return res.status(401).json({ message: "Неверный логин или пароль" });
		}

		res.status(200).json({ message: "Вход выполнен успешно" });
	} catch (e) {
		res.status(500).json({ message: `Ошибка при входе в админ панель: ${e}` });
	}
});

router.get("/checkAdmin/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId || isNaN(Number(userId))) {
			return res.status(400).json({
				message: "Неверные параметры запроса, userId must be a number",
			});
		}

		const user = await User.findOne({ where: { psuid: userId } });
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
