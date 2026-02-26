import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "./../db.ts";
import { Product } from "./Product.ts";

type OrderStatus = "pending" | "processing" | "ready to give" | "delivered" | "cancelled"; // "paid" после "pending"

export interface OrderAttributes {
	id: number;
	userId: number;
	userName: string;
	email: string;
	phoneNumber: string;
	promocode: string | null;
	city: string;
	totalPrice: number;
	status: OrderStatus;
}

type OrderCreationAttributes = Optional<OrderAttributes, "id">;

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
	declare id: number;
	declare userId: number;
	declare userName: string;
	declare email: string;
	declare phoneNumber: string;
	declare promocode: string | null;
	declare city: string;
	declare totalPrice: number;
	declare items: Product[];
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
		userName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		promocode: {
			type: DataTypes.STRING,
		},
		city: {
			type: DataTypes.STRING,
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
