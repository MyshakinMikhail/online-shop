import { Router } from "express";
import { authController } from "../controllers/index.ts";

const router = Router();

router.post("/yandex", authController.doAuth);

router.get("/checkUser/:psuid", authController.isAuth);

export default router;
