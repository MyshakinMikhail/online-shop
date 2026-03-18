import { Router } from "express";
import { cartConteroller } from "../controllers/index.ts";

const router = Router();

router.get("/:userId", cartConteroller.getCart);

router.delete("/:userId", cartConteroller.deleteCart);

export default router;
