import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./../db";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderAttributes {
	id: number;
	userId: number;
	// items: Product[];
	totalPrice: number;
	status: OrderStatus;
}

type OrderCreationAttributes = Optional<OrderAttributes, "id">;

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
	declare id: number;
	declare userId: number;
	declare totalPrice: number;
	declare status: OrderStatus;
}

Order.init(
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
		totalPrice: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0, // цена не может быть отрицательной
			},
		},
		status: {
			type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"),
			defaultValue: "pending",
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "orders",
		modelName: "Order",
		timestamps: true,
	}
);

export default Order;
