import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const isTestingStatus = process.env.IS_TESTING_STATUS;

const sequelize = new Sequelize({
	database: isTestingStatus ? process.env.DB_NAME_TEST : process.env.DB_NAME,
	// database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: String(process.env.DB_PASSWORD || ""),
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || "5432"),
	dialect: "postgres",
	logging: false,
});

export default sequelize;
