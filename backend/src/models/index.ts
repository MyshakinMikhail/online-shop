import Category from "./Category.ts";
import { Product } from "./Product.ts";
import { User } from "./User.ts";

Category.hasMany(Product, {
	foreignKey: "categoryId",
	as: "products",
});
Product.belongsTo(Category, { foreignKey: "categoryId" });

export type ModelsType = Category | Product | User;
export { Category, Product, User };
