import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "./../db.ts";
import { Product } from "./Product.ts";

export interface FavoriteAttributes {
	id: number;
	userId: number;
	productId: number;
}

type FavoriteCreatedAttributes = Optional<FavoriteAttributes, "id">;

class Favorite
	extends Model<FavoriteAttributes, FavoriteCreatedAttributes>
	implements FavoriteAttributes
{
	declare id: number;
	declare userId: number;
	declare productId: number;
	declare product: Product;
}

Favorite.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "favorites",
		modelName: "Favorites",
	}
);

export default Favorite;
