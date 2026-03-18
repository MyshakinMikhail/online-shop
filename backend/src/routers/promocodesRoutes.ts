import { Router } from "express";
import { promocodesController } from "../controllers/index.ts";

const router = Router();

router.get("/:userId", promocodesController.getAllPromocodes);
router.delete("/:userId", promocodesController.getAllPromocodes);

export default router;
