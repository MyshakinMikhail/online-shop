import { Router } from "express";
import { favoritesController } from "../controllers/index.ts";

const router = Router();

router.get("/:userId", favoritesController.getFavorites);

router.delete("/:userId", favoritesController.deleteFavorites);

export default router;
