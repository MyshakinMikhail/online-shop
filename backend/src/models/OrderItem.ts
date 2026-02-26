import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "./../db.ts";

export interface OrderItemAttributes {
	id: number;
	orderId: number;
	productId: number;
	quantity: number;
	priceAtPurchase: number;
}

type OrderItemCreationAttributes = Optional<OrderItemAttributes, "id">;

class OrderItem
	extends Model<OrderItemAttributes, OrderItemCreationAttributes>
	implements OrderItemAttributes
{
	declare id: number;
	declare orderId: number;
	declare productId: number;
	declare quantity: number;
	declare priceAtPurchase: number;
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
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		priceAtPurchase: {
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
