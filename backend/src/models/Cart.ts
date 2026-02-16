import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "./../db.ts";
import { Product } from "./Product.ts";

export interface CartAttributes {
	id: number;
	userId: number;
}

type CartCreationAttributes = Optional<CartAttributes, "id">;

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
	declare id: number;
	declare userId: number;
	declare items: Product[];
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
	},
	{
		sequelize,
		tableName: "carts",
		modelName: "Cart",
		timestamps: true,
	}
);

export default Cart;
