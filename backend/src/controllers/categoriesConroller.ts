import type { Request, Response } from "express";
import { Category } from "../models/index.ts";
import { CategoryService } from "../services/index.ts";
import { validateCategorySlug } from "../utils/validation/validation.ts";

export const categoriesController = {
	getAllCategories: async (req: Request, res: Response) => {
		try {
			const categories = await Category.findAll();

			if (!categories) {
				return res.status(404).json({ message: "Категорий не существует" });
			}
			res.status(200).json({ categories });
		} catch (error) {
			res.status(500).json({ message: "Ошибка получения категорий на сервере" });
		}
	},
	getCategoryBySlug: async (req: Request, res: Response) => {
		try {
			const { slug } = req.params;

			const slugValidationResult = validateCategorySlug(slug);
			if (!slugValidationResult.isValid || !slugValidationResult.slug) {
				return res.status(400).json({
					message: slugValidationResult.error || "Неверные параметры запроса",
				});
			}

			const category = await CategoryService.findBySlug(slugValidationResult.slug);
			if (!category) {
				return res.status(404).json({ message: "Категории не существует" });
			}
			res.status(200).json({ category });
		} catch (error) {
			res.status(500).json({ message: "Ошибка получения категории на сервере" });
		}
	},
};
