import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "./../db.ts";
import { Product } from "./Product.ts";

export interface CartItemAttributes {
	id: number;
	cartId: number;
	productId: number;
	quantity: number;
}

type CartItemCreationAttributes = Optional<CartItemAttributes, "id">;

class CartItem
	extends Model<CartItemAttributes, CartItemCreationAttributes>
	implements CartItemAttributes
{
	declare id: number;
	declare cartId: number;
	declare productId: number;
	declare quantity: number;
	declare product: Product;
}

CartItem.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "cartItem",
		modelName: "CartItem",
		timestamps: true,
	}
);

export default CartItem;
