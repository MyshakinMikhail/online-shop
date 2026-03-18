import { Router } from "express";
import { promocodeController } from "../controllers/index.ts";

const router = Router();

router.post("/:userId", promocodeController.addPromocode);
router.put("/:userId", promocodeController.updatePromocode);
router.delete("/:userId", promocodeController.deletePromocode);

export default router;
