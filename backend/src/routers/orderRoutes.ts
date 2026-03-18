import { Router } from "express";
import { orderController } from "../controllers/index.ts";

const router = Router();

router.post("/:userId", orderController.createOrder);

export default router;
