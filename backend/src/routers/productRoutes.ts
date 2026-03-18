import { Router } from "express";
import { productController } from "../controllers/index.ts";

const router = Router();

router.get("/:userId/:productId", productController.getProduct);

router.post("/:userId", productController.addProduct);

router.put("/:userId", productController.updateProduct);

router.delete("/:userId/:productId", productController.deleteProduct);

export default router;
