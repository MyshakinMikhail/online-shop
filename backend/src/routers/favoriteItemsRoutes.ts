import { Router } from "express";

import { favoriteItemsController } from "../controllers/index";

const router = Router();

router.post("/:userId", favoriteItemsController.addFavoriteProduct);
router.delete("/:userId", favoriteItemsController.deleteFavoriteProduct);

export default router;
