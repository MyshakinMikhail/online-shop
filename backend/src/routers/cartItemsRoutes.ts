import { Router } from "express";
import { cartItemsController } from "../controllers/cartItemsController.ts";

const router = Router();

router.post("/:userId", cartItemsController.addProduct);

router.put("/:userId", cartItemsController.updateProduct);

router.delete("/:userId", cartItemsController.deleteProduct);

export default router;
