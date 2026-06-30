import { Router } from "express";

import { categoriesController } from "../controllers/index";

const router = Router();

router.get("/", categoriesController.getAllCategories);

router.get("/:slug", categoriesController.getCategoryBySlug);

export default router;
