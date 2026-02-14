import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./../db";

export interface OrderItemAttributes {
	id: number;
	orderId: number;
	productId: number;
}

type OrderItemCreationAttributes = Optional<OrderItemAttributes, "id">;

class OrderItem
	extends Model<OrderItemAttributes, OrderItemCreationAttributes>
	implements OrderItemAttributes
{
	declare id: number;
	declare orderId: number;
	declare productId: number;
}

OrderItem.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		orderId: {
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
		tableName: "orderItem",
		modelName: "OrderItem",
		timestamps: true,
	}
);

export default OrderItem;
