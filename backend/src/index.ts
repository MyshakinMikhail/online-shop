import dotenv from "dotenv";
import express from "express";
import sequelize from "./db.ts";
import "./models/index.ts";
import { User } from "./models/index.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		await User.update(
			{
			  first_name: "ChangeName",
			},
			{
			  where: {
				psuid: "112345678901",
			  },
			}
		  )

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (e) {
		console.error("❌ Error starting server:", e);
	}
};

start();
