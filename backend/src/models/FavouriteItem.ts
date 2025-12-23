import type { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";
import sequelize from "../db.ts";
import Product from "./Product.ts";
import User from "./User.ts";

export interface FavouriteItemAttributes {
	id: number;
	user_id: number;
	product_id: number;
}

type FavouriteItemCreationAttributes = Optional<FavouriteItemAttributes, "id">;

class FavouriteItem
	extends Model<FavouriteItemAttributes, FavouriteItemCreationAttributes>
	implements FavouriteItemAttributes
{
	public id!: number;
	public user_id!: number;
	public product_id!: number;
}

FavouriteItem.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Product,
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		sequelize,
		tableName: "favourite_items",
		modelName: "FavouriteItem",
		timestamps: false,
	}
);

FavouriteItem.belongsTo(User, { foreignKey: "user_id" });
FavouriteItem.belongsTo(Product, { foreignKey: "product_id" });

export default FavouriteItem;
