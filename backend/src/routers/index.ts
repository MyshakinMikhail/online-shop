import { Router } from "express";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import cartItemsRoutes from "./cartItemsRoutes";
import cartRoutes from "./cartRoutes";
import categoriesRoutes from "./categoriesRoutes";
import favoriteItemsRoutes from "./favoriteItemsRoutes";
import favoritesRoutes from "./favoritesRoutes";
import orderRoutes from "./orderRoutes";
import productRoutes from "./productRoutes";
import productsRoutes from "./productsRoutes";
import promocodeRoutes from "./promocodeRoutes";
import promocodesRoutes from "./promocodesRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productsRoutes);
router.use("/product", productRoutes);
router.use("/categories", categoriesRoutes);
router.use("/cart/items", cartItemsRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", adminRoutes);
router.use("/order", orderRoutes);
router.use("/favorite/items", favoriteItemsRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/promocodes", promocodesRoutes);
router.use("/promocode", promocodeRoutes);

export default router;
