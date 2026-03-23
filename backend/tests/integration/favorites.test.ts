import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { clearTables } from "../../src/db/index.ts";
import { app } from "../../src/index.ts";
import { mockFavoritesForCreate } from "../../src/mocks/favorites/index.ts";
import { mockTestUser } from "../../src/mocks/users/mockTestUsers.ts";
import Category from "../../src/models/Category.ts";
import { Favorite } from "../../src/models/Favorite.ts";
import { Product } from "../../src/models/Product.ts";
import { User } from "../../src/models/User.ts";
import { mockCategories } from "./../../src/mocks/categories/mockCategories";
import { mockProducts } from "./../../src/mocks/products/mockProducts";

const user = mockTestUser;
const favorites = mockFavoritesForCreate;
const products = mockProducts.slice(0, 3);
const category = mockCategories[1];

beforeEach(async () => {
	await clearTables();

	// создание мокового пользователя и избранных товаров для него
	await User.create(user);
	await Category.create(category);

	for (let product of products) {
		await Product.create(product);
	}
});

describe("Favorites API", () => {
	describe("GET favorites/:userId", () => {
		it("Возвращает избранные товары для пользователя", async () => {
			for (let favorite of favorites) {
				await Favorite.create(favorite);
			}

			const res = await request(app).get(`/api/favorites/${user.psuid}`);

			expect(res.status).toBe(200);
			expect(res.body.products).not.toBeNull();
			expect(Array.isArray(res.body.products)).toBe(true);

			const products = await Favorite.findAll({ where: { userId: user.psuid } });
			expect(products.length).toBe(favorites.length);

			const productIds = products.map(p => p.id);
			const favoriteIds = favorites.map(f => f.productId);
			expect(productIds).toEqual(favoriteIds);
		});

		it("Возвращает пустой массив избранных товары, когда избранных нет", async () => {
			const res = await request(app).get(`/api/favorites/${user.psuid}`);

			expect(res.status).toBe(200);
			expect(res.body.products).not.toBeNull();
			expect(Array.isArray(res.body.products)).toBe(true);

			const products = await Favorite.findAll({ where: { userId: user.psuid } });
			expect(products.length).toBe(0);
			expect(products).toEqual([]);
		});
	});

	describe("DELETE favorites/:userId", () => {
		it("Удаляет все избранные товары пользователя", async () => {
			for (let favorite of favorites) {
				await Favorite.create(favorite);
			}

			// проверка, что избранные продукты реально существовали и были впоследствии удалены
			const currUserFavoriteProducts = await Favorite.findAll({
				where: { userId: user.psuid },
			});
			expect(Array.isArray(currUserFavoriteProducts)).toBe(true);
			expect(currUserFavoriteProducts.length).toBe(favorites.length);
			const productIds = currUserFavoriteProducts.map(pr => pr.id);
			const favoriteIds = favorites.map(fa => fa.productId);
			expect(productIds).toEqual(favoriteIds);

			const res = await request(app).delete(`/api/favorites/${user.psuid}`);

			expect(res.status).toBe(200);

			const userFavoriteProducts = await Favorite.findAll({ where: { userId: user.psuid } });
			expect(userFavoriteProducts).toEqual([]);
		});
	});
});
