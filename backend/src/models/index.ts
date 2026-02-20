import Cart from "./Cart.ts";
import CartItem from "./CartItem.ts";
import Category from "./Category.ts";
import Favorite from "./Favorite.ts";
import Order from "./Order.ts";
import OrderItem from "./OrderItem.ts";
import { Product } from "./Product.ts";
import { User } from "./User.ts";

Category.hasMany(Product, {
	foreignKey: "categoryId",
	as: "products",
});
Product.belongsTo(Category, { foreignKey: "categoryId" });

Cart.hasMany(CartItem, {
	foreignKey: "cartId",
	as: "items",
});

CartItem.belongsTo(Cart, {
	foreignKey: "cartId",
	as: "cart",
});

CartItem.belongsTo(Product, {
	foreignKey: "productId",
	as: "product",
});

Product.hasMany(CartItem, {
	foreignKey: "productId",
	as: "cartItems",
});

Order.hasMany(OrderItem, {
	foreignKey: "orderId",
	as: "items",
});

OrderItem.belongsTo(Order, {
	foreignKey: "orderId",
	as: "order",
});

OrderItem.belongsTo(Product, {
	foreignKey: "productId",
	as: "product",
});

Product.hasMany(OrderItem, {
	foreignKey: "productId",
	as: "orderItems",
});

Favorite.belongsTo(Product, {
	foreignKey: "productId",
	as: "product",
});

export type ModelsType = Category | Product | User;
export { Cart, CartItem, Category, Favorite, Order, OrderItem, Product, User };
