import { categoryRuMap } from "../consts";
import type { Category } from "../types";

export default function getCategoryRuByCategory(category: Category): string {
	return categoryRuMap[category];
}
