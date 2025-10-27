import { categoryRuMap } from "@/shared/consts";
import type { Category } from "@/shared/types";

export default function getCategoryRuByCategory(category: Category): string {
	return categoryRuMap[category];
}
