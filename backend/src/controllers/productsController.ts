import type { Request, Response } from "express";
import { CartItem, OrderItem, User } from "../models/index.ts";
import { AuthService, FavoriteService } from "../services/index.ts";
import { ProductService } from "../services/ProductService/ProductService.ts";
import { validateId } from "../utils/index.ts";

type RequestParamsType = {
	userId: number;
};

type RequestQueryType = {
	page?: number;
	limit?: number;
	categoryId?: number;
	searchQuery?: string;
	isFavorites?: boolean;
};

export const productsController = {
	getProducts: async (req: Request<RequestParamsType, {}, RequestQueryType>, res: Response) => {
		try {
			const { userId } = req.params;
			const { page, limit, categoryId, searchQuery, isFavorites } = req.query;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(404).json({ message: "Данного пользователя не существует" });
			}

			const normalizedSearchQuery =
				typeof searchQuery === "string"
					? searchQuery
					: Array.isArray(searchQuery) && typeof searchQuery[0] === "string"
						? searchQuery[0]
						: undefined;

			if (normalizedSearchQuery != null) {
				const products = await ProductService.searchProductsByName(normalizedSearchQuery);

				return res.status(200).json({
					products: products,
					message: "Продукты по search-qyery получены успешно",
				});
			}

			const favoriteProducts = await FavoriteService.getAllUserFavorites(user.id);

			if (isFavorites) {
				const favorites = await FavoriteService.getAllFavoritesWithProducts(user.id);

				const products = favorites.map(fav => {
					const productData = fav.product?.get({ plain: true });
					if (productData.isActive) {
						return {
							...productData,
						};
					}
				});

				if (!products) {
					return res
						.status(404)
						.json({ message: "Избранных товаров не существует или товар не активен" });
				}
				return res.status(200).json({
					products,
					message: "Избранные продукты пользователя успешно получены",
				});
			}

			if (isNaN(Number(categoryId))) {
				return res.status(400).json({
					message: "Неверные параметры запроса",
					error: "categoryId must be a number",
				});
			}

			const favoriteIds = new Set(favoriteProducts.map(fav => fav.productId));

			const whereClause =
				Number(categoryId) === 1
					? { isActive: true }
					: { isActive: true, categoryId: Number(categoryId) };

			const normalizedLimit = Number(limit) || 16;
			const normalizedPage = Number(page) || 1;

			const { count, rows } = await ProductService.getActiveProductsPage({
				page: normalizedPage,
				limit: normalizedLimit,
				whereClause: whereClause,
			});

			const products = rows.map(row => {
				const product = row.get({ plain: true }); // превращает в объект без лишних полей
				return {
					...product,
					isFavorite: favoriteIds.has(product.id),
					...(user?.role === "user" && { isActive: true }),
				};
			});

			res.status(200).json({ products, count });
		} catch (error) {
			res.status(500).json({ message: `Ошибка получения продуктов: ${error}` });
		}
	},
	deleteProducts: async (req: Request, res: Response) => {
		try {
			const { userId } = req.params;

			const userIdValidationResult = validateId(userId);
			if (!userIdValidationResult.isValid || !userIdValidationResult.id) {
				return res.status(400).json({
					message: userIdValidationResult.error || "Неверные параметры запроса",
				});
			}

			const user = await User.findOne({ where: { psuid: userIdValidationResult.id } });
			if (!user) {
				return res.status(404).json({ message: "Пользователя с данным id не существует" });
			}

			if (!AuthService.hasAdminRights(user.role)) {
				return res
					.status(403)
					.json({ message: "Недостаточно прав для совершения данного действия" });
			}

			await FavoriteService.deleteAllFavorites();
			await CartItem.destroy({ where: {} });
			await OrderItem.destroy({ where: {} });
			await ProductService.deleteAllProducts();

			res.status(200).json({ message: "Все продукты успешно удалнены" });
		} catch (error) {
			res.status(500).json({ message: `Ошибка удаления продукта: ${error}` });
		}
	},
};
