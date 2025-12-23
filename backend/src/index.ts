import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fromZodError } from "zod-validation-error";
import sequelize from "./db.ts";
import "./models/index.ts";
import { FavouriteItem, Product, User } from "./models/index.ts";
import { ProductsQuerySchema } from "./schemas/productsQuery.ts";

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
		await User.create(req.body.user);
		res.status(200).json({ message: "Пользователь успешно создан" });
	} catch (e) {
		res.status(500).json(e);
	}
});

app.get("/api/products", async (req, res) => {
	try {
		if (req.query.category === undefined) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "category is required",
			});
		}

		const result = ProductsQuerySchema.safeParse(req.query);

		if (!result.success) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: fromZodError(result.error).toString(),
			});
		}

		let whereClause =
			result.data.category === "all" ? undefined : result.data;

		const products = await Product.findAll({ where: whereClause });
		res.status(200).json({ data: { products } });
	} catch (error) {
		res.status(500).json({ message: "Ошибка получения продуктов" });
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
		res.status(200).json({ data: { product } });
	} catch (e) {
		res.status(500).json({ message: "Ошибка получения продукта по id" });
	}
});

app.get("/api/favourites", async (req, res) => {
	try {
		// желательно возвращать избранные только если пользователь авторизован
		// добавить это после перемещения авторизации через Яндекс ID на бэк
		const { userId } = req.body;
		if (!userId) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "user_id is required",
			});
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
				error: "user not found",
			});
		}

		const favourites = await FavouriteItem.findAll({
			where: { user_id: userId },
			include: [
				{
					model: Product,
					attributes: [
						"id",
						"name",
						"description",
						"sizes",
						"article",
						"price",
						"category",
						"stock",
						"image_url",
						"images",
						"is_active",
					],
				},
			],
			attributes: [],
		});

		const products = favourites.map((fav) => fav.Product);

		res.json({ data: { products } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Ошибка при загрузке избранного" });
	}
});

app.post("/api/favourites", async (req, res) => {
	try {
		const { userId, productId } = req.body;
		if (!userId || !productId) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "user_id and product_id are required",
			});
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
				error: "user not found",
			});
		}

		const product = await Product.findByPk(productId);
		if (!product) {
			return res.status(404).json({
				message: "Товар не найден",
				error: "product not found",
			});
		}

		const newFavouriteProduct = await FavouriteItem.create({
			user_id: userId,
			product_id: productId,
		});
		res.status(200).json({
			data: { newFavouriteProduct },
			message: "Товар добавлен в избранное",
		});
	} catch (e) {
		res.status(500).json("Ошибка при добавлении избранного");
	}
});

app.delete("/api/favourites/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { psuid } = req.body;
		if (!id) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "id is required",
			});
		}

		if (!psuid) {
			return res.status(400).json({
				message: "Неверные параметры запроса",
				error: "psuid is required",
			});
		}

		const user = await User.findOne({ where: { psuid } });

		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден",
				error: "user not found",
			});
		}

		const deletedItem = await FavouriteItem.destroy({
			where: {
				user_id: user.id,
				product_id: id,
			},
		});

		if (!deletedItem) {
			res.status(404).json({ message: "Избранное не найдено" });
		}

		res.status(200).json({
			data: { deletedItem },
			message: "Избранное удалено",
		});
	} catch (e) {
		res.status(500).json({ message: "Ошибка удаления избранного" });
	}
});

// admin routes
app.post("/api/admin/login", async (req, res) => {
	try {
		const { login, password } = req.body;
		if (!login || !password) {
			return res
				.status(400)
				.json({ message: "Неверные параметры запроса" });
		}
		if (
			login !== process.env.ADMIN_LOGIN ||
			password !== process.env.ADMIN_PASSWORD
		) {
			return res
				.status(401)
				.json({ message: "Неверный логин или пароль" });
		}

		res.status(200).json({ message: "Вход выполнен успешно" });
	} catch (e) {
		res.status(500).json({ message: "Ошибка при входе в админ панель" });
	}
});

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("❌ Error starting server:", error);
	}
};

start().catch(console.error);
