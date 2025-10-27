import { categories } from "@/shared/consts";
import type { Category } from "@/shared/types";
import { useParams } from "react-router-dom";

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
