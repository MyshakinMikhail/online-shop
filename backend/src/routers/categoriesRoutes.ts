import { Router } from "express";
import { Category } from "../models/index.ts";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const categories = await Category.findAll();

		if (!categories) {
			return res.status(404).json({ message: "Категорий не существует" });
		}
		res.status(200).json({ categories });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения категорий на сервере" });
	}
});

router.get("/:slug", async (req, res) => {
	try {
		const slug = req.params.slug;
		console.log(slug);
		const category = await Category.findOne({ where: { slug: slug } });
		if (!category) {
			return res.status(404).json({ message: "Категории не существует" });
		}
		res.status(200).json({ category });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения категории на сервере" });
	}
});

export default router;
