import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize({
	database: process.env.DB_NAME || "online-clothes",
	username: process.env.DB_USER || "postgres",
	password: String(process.env.DB_PASSWORD || ""),
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	dialect: "postgres",
	logging: false,
});

export default sequelize;
