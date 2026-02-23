import { Router, type Request } from "express";

const router = Router();

type RequestBodyType = {
	login: string;
	password: string;
};

router.post("/login", (req: Request<{}, {}, RequestBodyType>, res) => {
	try {
		const { login, password } = req.body;
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

export default router;
