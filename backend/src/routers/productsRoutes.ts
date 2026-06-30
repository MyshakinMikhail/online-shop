import { Router } from "express";
import { productsController } from "../controllers/index";

const router = Router();

router.get("/:userId", productsController.getProducts);
router.delete("/:userId", productsController.deleteProducts);

export default router;
