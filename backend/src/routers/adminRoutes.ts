import { Router } from "express";
import { adminController } from "../controllers/index";

const router = Router();

router.get("/checkAdmin/:userId", adminController.getUser);

export default router;
