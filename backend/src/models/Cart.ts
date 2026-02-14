import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./../db";
import { Product } from "./Product";

export interface CartAttributes {
	id: number;
	userId: number;
	quantity: number; // общая стоимость
}

type CartCreationAttributes = Optional<CartAttributes, "id">;

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
	declare id: number;
	declare userId: number;
	declare items?: Product[];
	declare quantity: number;
}

Cart.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "carts",
		modelName: "Cart",
		timestamps: true,
	}
);

export default Cart;
