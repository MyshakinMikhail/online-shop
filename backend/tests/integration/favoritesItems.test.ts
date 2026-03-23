import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { clearTables } from "../../src/db";
import { Category, Favorite, Product, User } from "../../src/models/index.ts";
import { ProductAttributes } from "../../src/models/Product.ts";
import { app } from "./../../src/index.ts";
import { mockCategories } from "./../../src/mocks/categories/mockCategories";
import { mockProducts } from "./../../src/mocks/products/index.ts";
import { mockTestUser } from "./../../src/mocks/users/mockTestUsers";

const user = mockTestUser;

const createdProducts: ProductAttributes[] = [];
const category = mockCategories[1];
let userId: number;

beforeEach(async () => {
	await clearTables();
	createdProducts.length = 0;

	const createdUser = await User.create(user);
	await Category.create(category);
	for (let product of mockProducts.slice(0, 2)) {
		const createdProduct: ProductAttributes = await Product.create(product);
		createdProducts.push(createdProduct);
	}

	userId = createdUser.id;

	// изначально есть один избранный товар
	await Favorite.create({ userId, productId: createdProducts[0].id });
});

describe("Favorite items API", () => {
	describe("POST favorite/items/:userId", () => {
		it("Ошибка добавления товара в избранное, невалидный userId", async () => {
			const notValidUserPsuid = "d2";
			const res = await request(app)
				.post(`/api/favorite/items/${notValidUserPsuid}`)
				.send({ productId: createdProducts[0].id });
			expect(res.status).toBe(400);
		});

		it("Ошибка добавления товара в избранное, невалидный productId", async () => {
			const notValidProductId = -12;
			const res = await request(app)
				.post(`/api/favorite/items/${userId}`)
				.send({ productId: notValidProductId });
			expect(res.status).toBe(400);
		});

		it("Ошибка добавления товара в избранное, пользователя с данным id не существует", async () => {
			const newUserId = 12;
			const res = await request(app)
				.post(`/api/favorite/items/${newUserId}`)
				.send({ productId: createdProducts[0].id });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Пользователя с данным id не существует");
		});

		it("Ошибка добавления товара в избранное, продукт уже в избранном", async () => {
			const res = await request(app)
				.post(`/api/favorite/items/${userId}`)
				.send({ productId: createdProducts[0].id });
			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Продукт уже в избранном");
		});

		it("Товар уже в избранном, вернется этот товар", async () => {
			const res = await request(app)
				.post(`/api/favorite/items/${user.psuid}`)
				.send({ productId: createdProducts[0].id });

			expect(res.status).toBe(200);

			const favoriteServerProduct = await Favorite.findOne({
				where: { userId, productId: createdProducts[0].id },
			});
			expect(favoriteServerProduct).not.toBeNull();
			expect(favoriteServerProduct!.productId).toBe(createdProducts[0].id);
		});

		it("Успешное добавление товара в избранное", async () => {
			const res = await request(app)
				.post(`/api/favorite/items/${user.psuid}`)
				.send({ productId: createdProducts[1].id });
			expect(res.status).toBe(201);

			const favoriteServerProduct = await Favorite.findOne({
				where: { userId, productId: createdProducts[1].id },
			});
			expect(favoriteServerProduct).not.toBeNull();
		});
	});

	describe("DELETE favorite/items/:userId", () => {
		it("Ошибка удаления товара из избранного, невалидный userId", async () => {
			const newUserId = -123;

			const res = await request(app)
				.delete(`/api/favorite/items/${newUserId}`)
				.send({ productId: createdProducts[0].id });

			expect(res.status).toBe(400);
		});

		it("Ошибка удаления товара из избранного, невалидный prouctId", async () => {
			const newUserId = "12d3";

			const res = await request(app)
				.delete(`/api/favorite/items/${newUserId}`)
				.send({ productId: createdProducts[0].id });

			expect(res.status).toBe(400);
		});

		it("Ошибка удаления товара из избранного, пользователя с данным psuid не существует", async () => {
			const newUserId = 3;

			const res = await request(app)
				.delete(`/api/favorite/items/${newUserId}`)
				.send({ productId: createdProducts[0].id });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Пользователя с данным id не существует");
		});

		it("Ошибка удаления товара из избранного, продукта с данным id не существует", async () => {
			const newProductId = 3;

			const res = await request(app)
				.delete(`/api/favorite/items/${userId}`)
				.send({ productId: newProductId });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Продукта с данным id не существует");
			// проверить, что в итоге ничего не удалилось из бд
		});

		it("Ошибка удаления товара из избранного, продукт не добавлен в избранное", async () => {
			const newProductId = createdProducts[1].id;

			const res = await request(app)
				.delete(`/api/favorite/items/${userId}`)
				.send({ productId: newProductId });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Данного товара уже нет в избранном");
		});

		it("Успешное удаление товара из избранного", async () => {
			const res = await request(app)
				.delete(`/api/favorite/items/${userId}`)
				.send({ productId: createdProducts[0].id });

			expect(res.status).toBe(200);

			const deletedProduct = await Favorite.findOne({
				where: { userId, productId: createdProducts[0].id },
			});
			expect(deletedProduct).toBeNull();
		});
	});
});
