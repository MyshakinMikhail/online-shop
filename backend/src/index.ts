import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB, sequelize } from "./db";
import "./models";
import router from "./routers";
import seeders from "./seeders";

dotenv.config();

const PORT = process.env.PORT || 3000;
export const app = express();

app.use(express.json());

app.use(
	cors({
		origin: [process.env.CLIENT_URL!, "http://localhost:5173"],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use("/api", router);

const start = async () => {
	try {
		await connectDB();

		// createDB()
		// clearAndCreateDB();

		// !!! не всю работу с моделями я вынес в сервисы, для экономии времени
		// model -> service -> controller -> router ( архитектура слоев бэка )

		await sequelize.sync({ alter: true });
		// await seeders.reseed(); // - перезагрузка моковых данные

		await seeders.seedTesting(); // - создание моковых данных
		// await seeders.clearAllData(); // - удаление моковых данных

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("❌ Error starting server:", error);
	}
};

start().catch(console.error);
