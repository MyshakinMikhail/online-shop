import { Router } from "express";
import { orderController } from "../controllers/index";

const router = Router();

router.post("/:userId", orderController.createOrder);

export default router;
