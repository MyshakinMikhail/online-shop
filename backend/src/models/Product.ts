import type { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";
import sequelize from "../db.ts";

export type ProductCategory = "all" | "tShirts" | "hoodies" | "longSleeves" | "trousers";

export interface ProductAttributes {
	id: number;
	name: string;
	description: string;
	sizes: string[];
	article: string;
	price: number;
	category: ProductCategory;
	categoryId: number;
	stock: number;
	image_url?: string | null;
	images?: string[] | null;
	is_active: boolean;
}

type ProductCreationAttributes = Optional<ProductAttributes, "id" | "image_url" | "images">;

class Product
	extends Model<ProductAttributes, ProductCreationAttributes>
	// первый параметр - тип атрибутов при чтении из БД, второй - тип атрибутов при создании
	implements ProductAttributes
{
	declare id: number;
	declare name: string;
	declare description: string;
	declare sizes: string[];
	declare article: string;
	declare price: number;
	declare category: ProductCategory;
	declare categoryId: number;
	declare stock: number;
	declare image_url: string | null | undefined;
	declare images: string[] | null | undefined;
	declare is_active: boolean;
}

Product.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true, // not null
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		sizes: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false,
		},
		article: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true, // unique - уникальное значение
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		category: {
			type: DataTypes.ENUM("all", "tShirts", "hoodies", "longSleeves", "trousers"),
			allowNull: false,
		},
		categoryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		image_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		images: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		sequelize,
		tableName: "products",
		modelName: "Product",
		timestamps: true,
	}
);

export default Product;
