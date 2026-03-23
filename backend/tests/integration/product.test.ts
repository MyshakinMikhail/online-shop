///  AAA-паттерн (Arrange-Act-Assert, подготовка данных -> действие -> проверка результат )

import request from "supertest";
import { v4 as uniqueArticle } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { clearTables } from "../../src/db/index.ts";
import { app } from "../../src/index.ts";
import { mockTestCategory } from "../../src/mocks/categories/index.ts";
import { mockProductForCreate } from "../../src/mocks/products/mockProductForCreate.ts";
import { mockTestAdmin, mockTestUser } from "../../src/mocks/users/index.ts";
import { Category, Product, User } from "../../src/models/index.ts";
import { ProductAttributes } from "../../src/models/Product.ts";

const user = mockTestUser;
const admin = mockTestAdmin;
let createdProduct: ProductAttributes;
let userId: number;
let adminId: number;

beforeEach(async () => {
	await clearTables();
	const product = mockProductForCreate;
	const category = mockTestCategory;

	// Создаём тестовые данные
	await Category.create(category);
	createdProduct = (await Product.create(product)).toJSON();

	const createdUser = await User.create(user);
	userId = createdUser.id;

	const createdAdmin = await User.create(admin);
	adminId = createdAdmin.id;
});

describe("Product API", () => {
	describe("GET /:userId/:productId", () => {
		it("Ошибка получения продукта: не валидный userId", async () => {
			const notValidUserId = 12.23;
			const res = await request(app).get(
				`/api/product/${notValidUserId}/${createdProduct.id}`
			);
			expect(res.status).toBe(400);
		});

		it("Ошибка получения продукта: не валидный productId", async () => {
			const notValidProductId = 12.23;
			const res = await request(app).get(`/api/product/${userId}/${notValidProductId}`);
			expect(res.status).toBe(400);
		});

		it("Ошибка получения продукта: пользователя с данным psuid не существует", async () => {
			const nweUserId = 3;
			const res = await request(app).get(`/api/product/${nweUserId}/${createdProduct.id}`);
			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Данного пользователя не существует");
		});

		it("Ошибка получения продукта: продукта с данным id не существует", async () => {
			const newProductId = 2;
			const res = await request(app).get(`/api/product/${userId}/${newProductId}`);
			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Товар не найден");
		});

		it("Успешно возвращает продукт", async () => {
			const res = await request(app).get(`/api/product/${user.psuid}/${createdProduct.id}`);

			//проверка ответа
			expect(res.status).toBe(200);
			expect(res.body.product).toHaveProperty("id", createdProduct.id);
			expect(res.body.product).toHaveProperty("isFavorite");

			const serverProduct = await Product.findByPk(createdProduct.id);
			expect(serverProduct).not.toBeNull();
		});
	});

	describe("POST /:userId", () => {
		it("Ошибка создания продукта, не валидный userId", async () => {
			const notValidUserId = 1.23;
			const article = uniqueArticle();
			const product = { ...mockProductForCreate, name: "New Product", article, price: -100 };
			const res = await request(app).post(`/api/product/${notValidUserId}`).send({ product });

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("id должен быть целым числом");
		});

		it("Ошибка создания продукта, пользователя с данным psuid не существует", async () => {
			const fakeUserPsuid = 10;
			const article = uniqueArticle();
			const product = { ...mockProductForCreate, name: "New Product", article };
			const res = await request(app).post(`/api/product/${fakeUserPsuid}`).send({ product });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Пользователя с данным id не существует");
		});

		it("Ошибка создания продукта, продукт с таким именем уже существует", async () => {
			const article = uniqueArticle();
			const product = {
				...mockProductForCreate,
				name: createdProduct.name,
				article,
			};
			const res = await request(app).post(`/api/product/${userId}`).send({ product });

			expect(res.status).toBe(409);
			expect(res.body.message).toBe("Продукт с таким названием уже существует");
		});

		it("Ошибка создания продукта, не валидный продукт", async () => {
			const article = uniqueArticle();
			const product = { ...mockProductForCreate, name: "New Product", article, price: -100 };
			const res = await request(app).post(`/api/product/${user.psuid}`).send({ product });

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Цена продукта должна быть положительным числом");
		});
		// все поля не хочу проверять будто бы и не надо

		it("Ошибка создания продукта, не создаёт продукт для пользователя с ролью 'user'", async () => {
			const article = uniqueArticle();
			const product = { ...mockProductForCreate, name: "New Product", article };
			const res = await request(app).post(`/api/product/${user.psuid}`).send({ product });

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Недостаточно прав для данного действия");

			const createdProduct = await Product.findOne({ where: { name: product.name } });
			expect(createdProduct).toBeNull();
		});

		it("Создаёт продукт (только админ)", async () => {
			const article = uniqueArticle();
			const product = { ...mockProductForCreate, name: "New Product", article };
			const res = await request(app).post(`/api/product/${adminId}`).send({ product });

			// проверка ответа
			expect(res.status).toBe(201);
			expect(res.body.createdProduct).toHaveProperty("id");
			expect(res.body.createdProduct.name).toBe("New Product");

			// артикул генерируется на бэке, поэтому не совпадает с текущим
			// проверка bd
			const productId = res.body.createdProduct.id;
			const newProduct = await Product.findByPk(productId);
			expect(newProduct).not.toBeNull();
		});
	});

	describe("PUT /:userId", () => {
		it("Ошибка обновления продукта, не валидный userId", async () => {
			const updatedProduct = { ...createdProduct, name: "Updated Product" };
			const notValidUserPsuid = [1, 3, 4];

			const res = await request(app)
				.put(`/api/product/${notValidUserPsuid}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("id должен быть числом");

			const updatedServerProduct = await Product.findOne({
				where: { id: createdProduct.id },
			});

			expect(updatedServerProduct).not.toBeNull();
			expect(updatedServerProduct!.name).toBe(createdProduct.name);
		});

		it("Ошибка обновления продукта, пользователя с данным id не существует", async () => {
			const updatedProduct = { ...createdProduct, name: "Updated Product" };
			const newUserPsuid = 3;

			const res = await request(app)
				.put(`/api/product/${newUserPsuid}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Пользователя с данным id не существует");

			const updatedServerProduct = await Product.findOne({
				where: { id: createdProduct.id },
			});

			expect(updatedServerProduct).not.toBeNull();
			expect(updatedServerProduct!.name).toBe(createdProduct.name);
		});

		it("Ошибка обновления продукта, не валидный продукт", async () => {
			const updatedProduct = { ...createdProduct, name: 123 };

			const res = await request(app)
				.put(`/api/product/${user.psuid}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Название продукта обязательно и должно быть строкой");

			const updatedServerProduct = await Product.findOne({
				where: { id: createdProduct.id },
			});

			expect(updatedServerProduct).not.toBeNull();
			expect(updatedServerProduct!.name).toBe(createdProduct.name);
		});

		it("Ошибка обноваления продукта, не обновляет продукт для пользователя с ролью 'user'", async () => {
			const updatedProduct = {
				...createdProduct,
				name: "Updated Product",
			};

			const res = await request(app)
				.put(`/api/product/${user.psuid}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Недостаточно прав для данного действия");

			const updatedServerProduct = await Product.findOne({
				where: { id: createdProduct.id },
			});

			expect(updatedServerProduct).not.toBeNull();
			expect(updatedServerProduct!.name).toBe(createdProduct.name);
		});

		it("Успешно обновляет продукт (только админ)", async () => {
			const product = await Product.findOne({ where: { name: "Test Product" } });
			if (!product) {
				if (!product) throw new Error("Тестовый продукт не найден");
			}

			const updatedProduct = { ...product.toJSON(), name: "Updated Product" };
			console.log(updatedProduct, "я в ахуе");

			const res = await request(app)
				.put(`/api/product/${adminId}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(200);
			expect(res.body.updatedProduct.name).toBe("Updated Product");

			const updatedServerProduct = await Product.findOne({ where: { id: product.id } });
			expect(updatedServerProduct).not.toBeNull();
		});

		it("Ошибка обноваления продукта, продукта с данным артикулом не существует", async () => {
			const updatedProduct = { ...createdProduct, name: "Updated Product", article: "None" };

			const res = await request(app)
				.put(`/api/product/${admin.psuid}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Продукта с таким артикулом нет");

			const updatedServerProduct = await Product.findOne({
				where: { id: createdProduct.id },
			});

			expect(updatedServerProduct).not.toBeNull();
			expect(updatedServerProduct!.name).toBe(createdProduct.name);
		});

		it("Ошибка обноваления продукта, продукт с данным названием уже существует", async () => {
			const newProduct = {
				...mockProductForCreate,
				name: "Other name",
				description: "Other description",
				article: "New article",
			};
			await Product.create(newProduct);
			// создали второй продукт

			const updatedProduct = {
				...createdProduct,
				name: "Other name",
				description: "Updated description",
			};

			const res = await request(app)
				.put(`/api/product/${admin.psuid}`)
				.send({ product: updatedProduct });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Продукт с таким названием уже существует");

			const updatedServerProduct = await Product.findOne({
				where: { id: createdProduct.id },
			});

			expect(updatedServerProduct).not.toBeNull();
			expect(updatedServerProduct!.description).toBe(createdProduct.description);
		});
	});

	describe("DELETE /:userId/:productId", () => {
		it("Ошибка, не валидный userId", async () => {
			const notValidUserPsuid = -1;
			const res = await request(app).delete(
				`/api/product/${notValidUserPsuid}/${createdProduct.id}`
			);
			expect(res.status).toBe(400);
			expect(res.body.message).toBe("id должен быть положительным числом");

			const notDeletedProduct = await Product.findByPk(createdProduct.id);

			expect(notDeletedProduct).not.toBeNull();
			expect(notDeletedProduct!.id).toBe(createdProduct.id);
		});

		it("Ошибка, не валидный productId", async () => {
			// так как я добавляю переменную в строку она приводится к строке поэтому будет "undefined"
			const res = await request(app).delete(`/api/product/${user.psuid}/${undefined}`);
			expect(res.status).toBe(400);
			expect(res.body.message).toBe("id должен быть числом");

			const notDeletedProduct = await Product.findByPk(createdProduct.id);

			expect(notDeletedProduct).not.toBeNull();
			expect(notDeletedProduct!.id).toBe(createdProduct.id);
		});

		it("Ошибка, пользователя с данным id не существует", async () => {
			// так как я добавляю переменную в строку она приводится к строке поэтому будет "undefined"
			const notCorrectUserPsuid = 3;
			const res = await request(app).delete(
				`/api/product/${notCorrectUserPsuid}/${createdProduct.id}`
			);
			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Пользователя с данным id не существует");

			const notDeletedProduct = await Product.findByPk(createdProduct.id);

			expect(notDeletedProduct).not.toBeNull();
			expect(notDeletedProduct!.id).toBe(createdProduct.id);
		});

		it("Ошибка, не удаляет продукт для обычного пользователя с ролью user", async () => {
			const res = await request(app).delete(
				`/api/product/${user.psuid}/${createdProduct.id}`
			);
			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Недостаточно прав для данного действия");

			const notDeletedProduct = await Product.findByPk(createdProduct.id);
			expect(notDeletedProduct).not.toBeNull();
			expect(notDeletedProduct!.id).toBe(createdProduct.id);
		});

		it("Ошибка, продукт с данным id не найден", async () => {
			const notCorrectProductId = 2;
			const res = await request(app).delete(
				`/api/product/${user.psuid}/${notCorrectProductId}`
			);
			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Недостаточно прав для данного действия");

			const notDeletedProduct = await Product.findByPk(createdProduct.id);
			expect(notDeletedProduct).not.toBeNull();
			expect(notDeletedProduct!.id).toBe(createdProduct.id);
		});

		it("Удаляет продукт ( только админ )", async () => {
			const res = await request(app).delete(`/api/product/${adminId}/${createdProduct.id}`);
			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Продукт успешно удален");

			const deletedProduct = await Product.findByPk(createdProduct.id);
			expect(deletedProduct).toBeNull();
		});
	});
});
