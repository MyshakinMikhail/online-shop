import { Router } from "express";

const router = Router();

router.get("/:userId", async (req, res) => {
	try {
		

	} catch (error) {
		res.status(500).json({ message: "Ошибка получения заказа пользователя" });
	}
});

export default router;
