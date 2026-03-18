import { beforeEach, describe, expect, it, vi } from "vitest";
import { Favorite, Product } from "../../models/index.ts";
import { mockFavorite, mockFavorites } from "./../../mocks/favorites/index.ts";
import { FavoriteService } from "./FavoriteService.ts";

vi.mock("../../models/index.ts", () => ({
	Favorite: {
		findOne: vi.fn(),
		findOrCreate: vi.fn(),
		destroy: vi.fn(),
		findAll: vi.fn(),
	},
	Product: {},
}));

describe("FavoriteService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getFavorite", () => {
		it("returns favorite when it exists", async () => {
			const userId = 1;
			const productId = 1;

			Favorite.findOne.mockResolvedValue(mockFavorite);

			const result = await FavoriteService.getFavorite(userId, productId);

			expect(Favorite.findOne).toHaveBeenCalledWith({
				where: { userId, productId },
			});
			expect(Favorite.findOne).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockFavorite);
		});

		it("returns null when favorite not found", async () => {
			const userId = 1;
			const productId = 1;

			Favorite.findOne.mockResolvedValue(null);

			const result = await FavoriteService.getFavorite(userId, productId);

			expect(Favorite.findOne).toHaveBeenCalledWith({
				where: { userId, productId },
			});
			expect(result).toBe(null);
		});
	});

	describe("findOrCreateFavorite", () => {
		it("returns true when favorite is created", async () => {
			const userId = 1;
			const productId = 1;

			Favorite.findOrCreate.mockResolvedValue([{}, true]);

			const result = await FavoriteService.findOrCreateFavorite(userId, productId);

			expect(Favorite.findOrCreate).toHaveBeenCalledWith({
				where: { userId, productId },
				defaults: { userId, productId },
			});
			expect(Favorite.findOrCreate).toHaveBeenCalledTimes(1);
			expect(result).toBe(true);
		});

		it("returns false when favorite already exists", async () => {
			const userId = 1;
			const productId = 1;

			Favorite.findOrCreate.mockResolvedValue([{}, false]);

			const result = await FavoriteService.findOrCreateFavorite(userId, productId);

			expect(Favorite.findOrCreate).toHaveBeenCalledWith({
				where: { userId, productId },
				defaults: { userId, productId },
			});
			expect(result).toBe(false);
		});
	});

	describe("deleteFavorite", () => {
		it("returns 1 when product was deleted", async () => {
			const userId = 1;
			const productId = 1;

			Favorite.destroy.mockResolvedValue(1);

			const result = await FavoriteService.deleteFavorite(userId, productId);

			expect(Favorite.destroy).toHaveBeenCalledWith({
				where: { userId, productId },
			});
			expect(Favorite.destroy).toHaveBeenCalledTimes(1);
			expect(result).toBe(1);
		});

		it("returns 0 when product wasn't deleted", async () => {
			const userId = 1;
			const productId = 1;

			Favorite.destroy.mockResolvedValue(0);

			const result = await FavoriteService.deleteFavorite(userId, productId);

			expect(Favorite.destroy).toHaveBeenCalledWith({
				where: { userId, productId },
			});
			expect(result).toBe(0);
		});
	});

	describe("getAllFavoritesWithProducts", () => {
		it("returns favorites with products", async () => {
			const userId = 1;

			const favorites = mockFavorites

			Favorite.findAll.mockResolvedValue(favorites);

			const result = await FavoriteService.getAllFavoritesWithProducts(userId);

			expect(Favorite.findAll).toHaveBeenCalledWith({
				where: { userId },
				include: [
					{
						model: Product,
						as: "product",
					},
				],
			});
			expect(result).toEqual(favorites);
		});
	});

	describe("getAllUserFavorites", () => {
		it("returns all user favorites", async () => {
			const userId = 1;

			const favorites = mockFavorites.map((favorite) => ({...favorite, userId}))

			Favorite.findAll.mockResolvedValue(favorites);

			const result = await FavoriteService.getAllUserFavorites(userId);

			expect(Favorite.findAll).toHaveBeenCalledWith({
				where: { userId },
			});
			expect(result).toEqual(favorites);
		});
	});

	describe("deleteAllUserFavorites", () => {
		it("returns number of deleted favorites", async () => {
			const userId = 1;

			Favorite.destroy.mockResolvedValue(3);

			const result = await FavoriteService.deleteAllUserFavorites(userId);

			expect(Favorite.destroy).toHaveBeenCalledWith({
				where: { userId },
			});
			expect(result).toBe(3);
		});
	});

	describe("deleteAllFavorites", () => {
		it("deletes all favorites", async () => {
			Favorite.destroy.mockResolvedValue(10);

			const result = await FavoriteService.deleteAllFavorites();

			expect(Favorite.destroy).toHaveBeenCalledWith({
				where: {},
			});
			expect(result).toBe(10);
		});
	});
});
