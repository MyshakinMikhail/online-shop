import type { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";
import sequelize from "../db.ts";

export type UserSex = "male" | "female" | "other";

export interface UserAttributes {
	id: number;
	psuid: string;
	first_name: string;
	last_name: string;
	sex: UserSex;
	default_email: string;
	is_buying_smth: boolean;
}

type UserCreationAttributes = Optional<
	UserAttributes,
	| "id"
>;

class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	declare id: number;
	declare psuid: string;
	declare first_name: string;
	declare last_name: string;
	declare sex: UserSex;
	declare default_email: string;
	declare is_buying_smth: boolean;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		psuid: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		sex: {
			type: DataTypes.ENUM("male", "female", "other"),
			allowNull: false,
		},
		default_email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_buying_smth: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize,
		tableName: "users",
		modelName: "User",
		timestamps: true,
	}
);

export default User;
