import dotenv from "dotenv";
import express from "express";
import sequelize from "./db.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
