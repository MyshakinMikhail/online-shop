// src/shared/lib/hooks/useCategoryFromPath.ts
import { useParams } from "react-router-dom";
import { categories } from "../consts";
import type { Category } from "../types";

function isValidCategory(value: string | undefined): value is Category {
	return categories.includes(value as Category);
}

export function useCategoryFromPath(): Category {
	const { category } = useParams<{ category?: string }>();

	if (isValidCategory(category)) {
		return category;
	}

	return "all";
}
