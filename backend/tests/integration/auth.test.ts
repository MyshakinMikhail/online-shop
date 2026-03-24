import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { clearTables } from "../../src/db/index.ts";
import { app } from "../../src/index.ts";
import { mockUserForCreate } from "../../src/mocks/users/index.ts";
import { User } from "../../src/models/index.ts";

const user = mockUserForCreate;

beforeEach(async () => {
	await clearTables();
	await User.create(user);
});

describe("Auth API", () => {
	describe("GET auth/checkUser/:psuid", () => {
		it("Ошибка возврата пользователя, не валидный userId", async () => {
			const notValidUserPsuid = "23f";
			const res = await request(app).get(`/api/auth/checkUser/${notValidUserPsuid}`);

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("id должен быть числом");
		});

		it("Ошибка возврата пользователя, пользователь с данным id не существует", async () => {
			const notCorrectUserPsuid = 2;
			const res = await request(app).get(`/api/auth/checkUser/${notCorrectUserPsuid}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Пользователь не найден");
		});

		it("Успешно возвращает пользователя", async () => {
			const res = await request(app).get(`/api/auth/checkUser/${user.psuid}`);

			expect(res.status).toBe(200);
			expect(res.body.user).toHaveProperty("id");
			expect(res.body.user.psuid).toBe(user.psuid);

			const userId = res.body.user.id;
			const serverUser = await User.findByPk(userId);
			expect(serverUser).not.toBeNull();
		});
	});

	describe("POST auth/yandex", () => {
		it("Ошибка авторизации, userId не валидный", async () => {
			const newUser = { ...user, psuid: -2, first_name: "New user" };

			const res = await request(app).post("/api/auth/yandex").send({ user: newUser });

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("id должен быть положительным числом");
		});

		it("Авторизовывает, но не создает нового пользователя в бд, если пользователь с данным psuid уже существует", async () => {
			const newUser = { ...user, first_name: "New user" };
			const res = await request(app).post("/api/auth/yandex").send({ user: newUser });

			expect(res.status).toBe(200);
			expect(res.body.user).not.toBeNull();

			const serverUser = await User.findOne({ where: { id: user.psuid } });
			expect(serverUser).toHaveProperty("id");
			expect(serverUser).toHaveProperty("role");
			expect(serverUser!.first_name).not.toBe("New user");
			expect(serverUser!.first_name).toBe(user.first_name);
		});

		it("Авторизовывает и создает нового пользователя в бд", async () => {
			const newUser = { ...user, psuid: 2, first_name: "New user" };
			console.log(newUser);

			const res = await request(app).post("/api/auth/yandex").send({ user: newUser });

			expect(res.status).toBe(201);

			const serverUser = await User.findOne({ where: { id: newUser.psuid } });

			expect(serverUser).toHaveProperty("id");
			expect(serverUser).not.toBeNull();
			expect(serverUser!.first_name).toBe("New user");
			expect(serverUser!.last_name).toBe(user.last_name);
			expect(serverUser!.role).toBe("user");
		});
	});
});
