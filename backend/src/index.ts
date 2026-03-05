import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./db.ts";
import "./models/index.ts";
import router from "./routers/index.ts";

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

app.use("/api", router);

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		// await seeders.reseed();

		// await seeders.seedTesting();
		// await seeders.clearAllData();

		app.listen(PORT, () => {
			console.log(`🚀 S	erver is running on port ${PORT}`);
		});

		console.log("server started");
	} catch (error) {
		console.error("❌ Error starting server:", error);
	}
};

start().catch(console.error);
