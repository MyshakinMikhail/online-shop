import Cart from "./Cart";
import CartItem from "./CartItem";
import Category from "./Category";
import { Favorite } from "./Favorite";
import Order from "./Order";
import OrderItem from "./OrderItem";
import { Product } from "./Product";
import { User } from "./User";

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
