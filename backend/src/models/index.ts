import FavouriteItem from "./FavouriteItem.ts";
import Product from "./Product.ts";
import User from "./User.ts";

User.hasMany(FavouriteItem, { foreignKey: "user_id" });
Product.hasMany(FavouriteItem, { foreignKey: "product_id" });

export { FavouriteItem, Product, User };
