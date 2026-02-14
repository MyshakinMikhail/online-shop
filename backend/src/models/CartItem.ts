import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./../db";

export interface CartItemAttributes {
	id: number;
	cartId: number;
	productId: number;
}

type CartItemCreationAttributes = Optional<CartItemAttributes, "id">;

class CartItem
	extends Model<CartItemAttributes, CartItemCreationAttributes>
	implements CartItemAttributes
{
	declare id: number;
	declare cartId: number;
	declare productId: number;
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
	},
	{
		sequelize,
		tableName: "cartItem",
		modelName: "CartItem",
		timestamps: true,
	}
);

export default CartItem;
