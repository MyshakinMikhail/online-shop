import { Favorite, Product } from "../../models/index.ts";

export const FavoriteService = {
	getFavorite: async (userId: number, productId: number) => {
		const product = await Favorite.findOne({
			where: { userId, productId },
		});
		return product;
	},

	findOrCreateFavorite: async (userId: number, productId: number) => {
		const [_, isAdded] = await Favorite.findOrCreate({
			where: { userId, productId },
			defaults: { userId, productId },
		});

		return isAdded;
	},

	deleteFavorite: async (userId: number, productId: number) => {
		const removedRows = await Favorite.destroy({ where: { userId, productId } });
		return removedRows;
	},

	getAllFavoritesWithProducts: async (userId: number) => {
		const products = await Favorite.findAll({
			where: { userId },
			include: [
				{
					model: Product,
					as: "product",
				},
			],
		});

		return products;
	},

	getAllUserFavorites: async (userId: number) => {
		const products = await Favorite.findAll({ where: { userId } });
		return products;
	},

	deleteAllUserFavorites: async (userId: number) => {
		const removedRows = await Favorite.destroy({ where: { userId } });
		return removedRows;
	},

	deleteAllFavorites: async () => {
		const removedRows = await Favorite.destroy({ where: {} });
		return removedRows;
	},
};
