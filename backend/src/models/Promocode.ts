import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.ts";


export type PromocodeAttributes = {
	id: number;
	name: string;
	isActive: boolean;
	discount: number;
};

export type PromocodeCreationAttributes = Optional<PromocodeAttributes, "id">;

export class Promocode
	extends Model<PromocodeAttributes, PromocodeCreationAttributes>
	implements PromocodeAttributes
{
	declare id: number;
	declare name: string;
	declare isActive: boolean;
	declare discount: number;
}

Promocode.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},

		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		discount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		sequelize,
		tableName: "promocode",
		modelName: "Promocode",
	}
);
