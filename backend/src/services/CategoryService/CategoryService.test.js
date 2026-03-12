import { beforeEach, describe, expect, it, vi } from "vitest";
import { Category } from "../../models/index.ts";
import { CategoryService } from "./CategoryService.ts";

vi.mock("../../models/index.ts", () => ({
	Category: {
		findOne: vi.fn(),
	},
}));

describe("CategoryService.findBySlug", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns category when slug exists", async () => {
		Category.findOne.mockResolvedValue({ id: 1, slug: "all", name: "Все товары" });

		const result = await CategoryService.findBySlug("all");

		expect(Category.findOne).toHaveBeenCalledWith({ where: { slug: "all" } });
		expect(result).toEqual({ id: 1, slug: "all", name: "Все товары" });
	});

	it("returns null when slug does not exist", async () => {
		Category.findOne.mockResolvedValue(null);

		const result = await CategoryService.findBySlug("invalid");

		expect(Category.findOne).toHaveBeenCalledWith({ where: { slug: "invalid" } });
		expect(result).toBeNull();
	});
});
