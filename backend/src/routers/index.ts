import { Router } from "express";
import adminRoutes from "./adminRoutes.ts";
import authRoutes from "./authRoutes.ts";
import cartItemsRoutes from "./cartItemsRoutes.ts";
import cartRoutes from "./cartRoutes.ts";
import categoriesRoutes from "./categoriesRoutes.ts";
import orderItemsRoutes from "./orderItemsRoutes.ts";
import orderRoutes from "./orderRoutes.ts";
import productsRoutes from "./productsRoutes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/cart/items", cartItemsRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", adminRoutes);
router.use("/order", orderRoutes);
router.use("/order/items", orderItemsRoutes);

export default router;
