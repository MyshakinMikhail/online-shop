import { Router } from "express";
import adminRoutes from "./adminRoutes.ts";
import authRoutes from "./authRoutes.ts";
import cartItemsRoutes from "./cartItemsRoutes.ts";
import cartRoutes from "./cartRoutes.ts";
import categoriesRoutes from "./categoriesRoutes.ts";
import productsRoutes from "./productsRoutes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/cart/items", cartItemsRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", adminRoutes);

export default router;
