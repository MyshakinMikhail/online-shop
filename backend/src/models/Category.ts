import type { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";
import sequelize from "../db.ts";

export interface CategoryAttributes {
	id: number;
	name: string;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;

class Category
	extends Model<CategoryAttributes, CategoryCreationAttributes>
	implements CategoryAttributes
{
	declare id: number;
	declare name: string;
}

Category.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		tableName: "categories",
		modelName: "Category",
		timestamps: false,
	}
);

export default Category;
