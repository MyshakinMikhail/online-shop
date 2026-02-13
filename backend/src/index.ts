import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./db.ts";
import "./models/index.ts";
import { Category, Product, User } from "./models/index.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.post("/api/auth/yandex/", async (req, res) => {
	try {
		if (!req.body?.user?.psuid) {
			return res.status(400).json({
				message: "Не указан Yandex ID пользователя",
			});
		}

		const userData = req.body.user;

		const [user, created] = await User.findOrCreate({
			where: { psuid: userData.psuid },
			defaults: userData,
		});

		if (!created) {
			await user.update(userData);
		}

		return res.status(created ? 201 : 200).json({
			message: created ? "Пользователь успешно создан" : "Данные пользователя обновлены",
			user: {
				id: user.id,
				psuid: user.psuid,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.default_email,
				role: user.role,
			},
			created,
		});
	} catch (error) {
		console.error("Auth error:", error);

		return res.status(500).json({
			message: "Ошибка при сохранении пользователя",
		});
	}
});

// Простой endpoint для проверки существования пользователя
// НЕ создает пользователя, только проверяет
app.get("/api/checkUser/:psuid", async (req, res) => {
	try {
		const psuid = req.params.psuid; // Это Yandex ID, не путать с нашим id

		// Ищем по psuid (Yandex ID), а не по id
		const user = await User.findOne({ where: { psuid } });

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
				found: false,
			});
		}

		res.status(200).json({
			message: "Пользователь найден",
			user: {
				id: user.id,
				psuid: user.psuid,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.default_email,
			},
			found: true,
		});
	} catch (error) {
		console.error("Error getting user:", error);
		res.status(500).json({
			message: "Ошибка получения пользователя",
		});
	}
});

app.get("/api/products", async (req, res) => {
	try {
		const { page, limit, categoryId } = req.query;

		if (!categoryId) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
			});
		}

		const whereClause = categoryId === "1" ? undefined : { categoryId: +categoryId };

		const { count, rows } = await Product.findAndCountAll({
			where: whereClause,
			limit: Number(limit) || 16,
			offset: ((Number(page) || 1) - 1) * (Number(limit) || 16),
		});

		res.status(200).json({ rows, count });
	} catch (error) {
		res.status(500).json({ message: `Ошибка получения продуктов: ${error}` });
	}
});

app.post("/api/products", async (req, res) => {
	try {
		// "product": {
		// 	"name": "Базовая футболка",
		// 	"description": "Классическая хлопковая футболка с круглым вырезом.",
		// 	"sizes": ["M"],
		// 	"article": "TSH-101",
		// 	"price": 1499,
		// 	"categoryId": 2,
		// 	"stock": 25
		// }

		const { product, userRole } = req.body;
		if (!userRole) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userRole is empty",
			});
		}

		if (!product) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "product is empty",
			});
		}

		if (userRole !== "admin" && userRole !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const [createdProduct, isCreated] = await Product.findOrCreate({
			where: { article: product.article },
			defaults: product,
		});

		if (!isCreated) {
			return res.status(200).json({ message: "Продукт уже создан" });
		}

		res.status(201).json({ createdProduct });
	} catch (e) {
		res.status(500).json({ message: "Ошибка создания продукта на сервере" });
	}
});

app.put("/api/products/:article", async (req, res) => {
	try {
		const { product, userRole } = req.body;
		if (!userRole) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userRole is empty",
			});
		}

		if (!product) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "product is empty",
			});
		}

		if (userRole !== "admin" && userRole !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const article = req.params.article;

		const findedProduct = await Product.findOne({ where: { article: article } });
		if (!findedProduct) {
			return res.status(404).json({
				message: "Продукта с таким артикулом нет",
			});
		}

		const updatedProduct = await Product.update(product, {
			where: { article: product.article },
		});
		res.status(200).json({ updatedProduct: updatedProduct, message: "Продукт обновлен" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка обновления продукта на сервере" });
	}
});

app.delete("/api/products/:article", async (req, res) => {
	try {
		const { userRole } = req.body;
		const { article } = req.params;
		if (!userRole) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "userRole is empty",
			});
		}

		if (!article) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса", error: "article is empty" });
		}

		if (userRole !== "admin" && userRole !== "super_admin") {
			return res.status(403).json({ message: "Недостаточно прав для данного действия" });
		}

		const product = await Product.findOne({ where: { article: article } });
		if (!product) {
			return res.status(404).json({ message: "Продукт не найден" });
		}

		await Product.destroy({ where: { article: article } });
		res.status(200).json({ message: "Продукт успешно удален" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка удаления продукта на сервере" });
	}
});

app.get("/api/products/:id", async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "id is required",
			});
		}

		const product = await Product.findByPk(id);

		if (product === null) {
			return res.status(404).json({
				message: "Товар не найден",
				error: "product not found",
			});
		}
		res.status(200).json({ product });
	} catch (e) {
		res.status(500).json({ message: `Ошибка получения продукта по id: ${e}` });
	}
});

app.get("/api/categories", async (req, res) => {
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

app.get("/api/category/:slug", async (req, res) => {
	try {
		const slug = req.params.slug;
		const category = await Category.findOne({ where: { slug: slug } });
		if (!category) {
			return res.status(404).json({ message: "Категории не существует" });
		}
		res.status(200).json({ category });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения категории на сервере" });
	}
});

app.post("/api/admin/login", (req, res) => {
	try {
		const { login, password } = req.body;
		if (!login || !password) {
			return res.status(400).json({ message: "Неверные параметры запроса" });
		}
		if (login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD) {
			return res.status(401).json({ message: "Неверный логин или пароль" });
		}

		res.status(200).json({ message: "Вход выполнен успешно" });
	} catch (e) {
		res.status(500).json({ message: `Ошибка при входе в админ панель: ${e}` });
	}
});

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});

		// await seeders.reseed();

		// await seeders.clearAllData();
		// await seeders.seedTesting();

		console.log("server started");
	} catch (error) {
		console.error("❌ Error starting server:", error);
	}
};

start().catch(console.error);
