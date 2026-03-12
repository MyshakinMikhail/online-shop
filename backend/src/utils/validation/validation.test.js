import { describe, expect, it } from "vitest";
import { validateCategorySlug, validateId, validateProductCreationAttributes, validatePromocodeDiscount, validatePromocodeName } from "./validation";

describe("validateId", () => {
	it("should return error if userId is undefined", () => {
		const result = validateId(undefined);
		expect(result.error).toBe("id обязателен");
	});
	it("should return error if userId is not a number", () => {
		const result = validateId("abc");
		expect(result.error).toBe("id должен быть числом");
	});
	it("should return error if userId is not a positive number", () => {
		const result = validateId(-1);
		expect(result.error).toBe("id должен быть положительным числом");
	});
	it("should return error if userId is not an integer", () => {
		const result = validateId(1.5);
		expect(result.error).toBe("id должен быть целым числом");
	});
	it("should return success", () => {
		const result = validateId(5);
		expect(result.isValid).toBe(true);
		expect(result.id).toBe(5);
	})
});

describe("validateCategorySlug", () => {
	it("should return error if slug is undefined", () => {
		const result = validateCategorySlug(undefined);
		expect(result.error).toBe("slug обязателен");
		expect(result.isValid).toBe(false);
	});
	it("should return error if slug is not a string", () => {
		const result = validateCategorySlug(123);
		expect(result.error).toBe("slug должен быть строкой");
		expect(result.isValid).toBe(false);
	});
	it("should return error if slug is empty after trim", () => {
		const result = validateCategorySlug("   ");
		expect(result.error).toBe("slug не может быть пустой строкой");
		expect(result.isValid).toBe(false);
	});
	it("should return normalized slug", () => {
		const result = validateCategorySlug(" shoes ");
		expect(result.isValid).toBe(true);
		expect(result.slug).toBe("shoes");
	});
});

describe("validatePromocodeName", () => {
	it("should return error if name is undefined", () => {
		const result = validatePromocodeName(undefined);
		expect(result.error).toBe("Название промокода обязательно");
		expect(result.isValid).toBe(false);
	})
	it("should return error if name is not a string", () => {
		const result = validatePromocodeName(123);
		expect(result.isValid).toBe(false);
		expect(result.error).toBe("Название промокода должно быть строкой");
	})
	it("should return error if name is empty after trim", () => {
		const result = validatePromocodeName("   ");
		expect(result.isValid).toBe(false);
		expect(result.error).toBe("Название промокода не может быть пустой строкой");
	})
	it("should return success", () => {
		const result = validatePromocodeName("WELCOME10");
		expect(result.isValid).toBe(true);
		expect(result.name).toBe("WELCOME10");
	})
})

describe("valifatePromocodeDiscount", () => {
	it("should return error if discount is undefinded", () => {
		const result = validatePromocodeDiscount(undefined);
		expect(result.error).toBe("Скидка обязательна");
		expect(result.isValid).toBe(false);
	})
	it("shouls return error if discount not a number", () => {
		const result = validatePromocodeDiscount("100");
		expect(result.isValid).toBe(false);
		expect(result.error).toBe("Скидка должна быть числом");
	})
	it("should return error if discount out of range", () => {
		const result = validatePromocodeDiscount(101);
		expect(result.isValid).toBe(false);
		expect(result.error).toBe("Скидка должна быть в диапазоне от 0 до 100");
	})
	it("should return error if discount not an integer", () => {
		const result = validatePromocodeDiscount(-1);
		expect(result.isValid).toBe(false);
		expect(result.error).toBe("Скидка должна быть в диапазоне от 0 до 100");
	})
	it("should return success", () => {
		const result = validatePromocodeDiscount(50);
		expect(result.isValid).toBe(true);
		expect(result.discount).toBe(50);
	})
})

describe("validateProductCreationAttributes", () => {
	const validProduct = {
		name: "Basic T-Shirt",
		description: "Хорошая базовая футболка из плотного хлопка",
		sizes: ["S", "M", "L"],
		article: "ART-001",
		price: 1999,
		categoryId: 2,
		stock: 10,
		isActive: true,
	};

	describe("product object", () => {
		it("should return error if product is undefined", () => {
			const result = validateProductCreationAttributes(undefined);
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Объект продукта обязателен");
		});

		it("should return error if product is not an object", () => {
			const result = validateProductCreationAttributes("product");
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Продукт должен быть объектом");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes(validProduct);
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual(validProduct);
		});
	});

	describe("name", () => {
		it("should return error if name is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, name: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Название продукта обязательно и должно быть строкой");
		});

		it("should return error if name is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, name: 123 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Название продукта обязательно и должно быть строкой");
		});

		it("should return error if name is empty", () => {
			const result = validateProductCreationAttributes({ ...validProduct, name: "   " });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Название продукта не может быть пустым");
		});

		it("should return error if name is too short", () => {
			const result = validateProductCreationAttributes({ ...validProduct, name: "ab" });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Название продукта должно содержать минимум 3 символа");
		});

		it("should return error if name is too long", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				name: "a".repeat(201),
			});
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Название продукта не должно превышать 200 символов");
		});
		
		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				name: "Basic T-Shirt",
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({ ...validProduct, name: "Basic T-Shirt" });
		});
	});

	describe("description", () => {
		it("should return error if description is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, description: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Описание продукта обязательно и должно быть строкой");
		});
		it("should return error if description is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, description: 123 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Описание продукта обязательно и должно быть строкой");
		});

		it("should return error if description is empty", () => {
			const result = validateProductCreationAttributes({ ...validProduct, description: "   " });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Описание продукта не может быть пустым");
		});

		it("should return error if description is too short", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				description: "Коротко",
			});
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Описание продукта должно содержать минимум 10 символов");
		});

		it("should return error if description is too long", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				description: "a".repeat(5001),
			});
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Описание продукта не должно превышать 5000 символов");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				description: "Хорошая базовая футболка из плотного хлопка",
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({
				...validProduct,
				description: "Хорошая базовая футболка из плотного хлопка",
			});
		});

	});

	describe("sizes", () => {
		it("should return error if sizes is not array", () => {
			const result = validateProductCreationAttributes({ ...validProduct, sizes: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Размеры продукта обязательны и должны быть массивом");
		});
		it("should return error if sizes is not array", () => {
			const result = validateProductCreationAttributes({ ...validProduct, sizes: "[1, 2, 3]"});
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Размеры продукта обязательны и должны быть массивом");
		});

		it("should return error if sizes is empty", () => {
			const result = validateProductCreationAttributes({ ...validProduct, sizes: [] });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("У продукта должен быть хотя бы один размер");
		});

		it("should return error if any size is invalid", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				sizes: ["S", " ", "L"],
			});
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Все размеры должны быть непустыми строками");
		});

		it("should return error if any size is invalid", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				sizes: ["S", 1, "L"],
			});
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Все размеры должны быть непустыми строками");
		});
		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				sizes: ["S", "M", "L"],
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({
				...validProduct,
				sizes: ["S", "M", "L"],
			});
		});
	});

	describe("article", () => {
		it("should return error if article is not string", () => {
			const result = validateProductCreationAttributes({ ...validProduct, article: 123 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Артикул продукта обязателен и должен быть строкой");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				article: "ART-001",
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({ ...validProduct, article: "ART-001" });
		});
	});

	describe("price", () => {
		it("should return error if price is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, price: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Цена продукта обязательна");
		});

		it("should return error if price is not number", () => {
			const result = validateProductCreationAttributes({ ...validProduct, price: "1000" });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Цена продукта должна быть корректным числом");
		});

		it("should return error if price <= 0", () => {
			const result = validateProductCreationAttributes({ ...validProduct, price: 0 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Цена продукта должна быть положительным числом");
		});

		it("should return error if price is not integer", () => {
			const result = validateProductCreationAttributes({ ...validProduct, price: 10.5 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Цена продукта должна быть целым числом");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				price: 1999,
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({ ...validProduct, price: 1999 });
		});
	});

	describe("categoryId", () => {
		it("should return error if categoryId is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, categoryId: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("categoryId обязателен");
		});

		it("should return error if categoryId is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, categoryId: null });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("categoryId обязателен");
		});

		it("should return error if categoryId <= 0", () => {
			const result = validateProductCreationAttributes({ ...validProduct, categoryId: 0 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("categoryId должен быть положительным числом");
		});

		it("should return error if categoryId is not integer", () => {
			const result = validateProductCreationAttributes({ ...validProduct, categoryId: 1.2 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("categoryId должен быть целым числом");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				categoryId: 2,
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({ ...validProduct, categoryId: 2 });
		});
	});

	describe("stock", () => {
		it("should return error if stock is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, stock: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Количество товара на складе обязательно");
		});

		it("should return error if stock is null", () => {
			const result = validateProductCreationAttributes({ ...validProduct, stock: null });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Количество товара на складе обязательно");
		});

		it("should return error if stock < 0", () => {
			const result = validateProductCreationAttributes({ ...validProduct, stock: -1 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Количество товара на складе не может быть отрицательным");
		});

		it("should return error if stock is not integer", () => {
			const result = validateProductCreationAttributes({ ...validProduct, stock: 1.5 });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("Количество товара на складе должно быть целым числом");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				stock: 10,
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({ ...validProduct, stock: 10 });
		});
	});

	describe("isActive", () => {
		it("should return error if isActive is undefined", () => {
			const result = validateProductCreationAttributes({ ...validProduct, isActive: undefined });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("isActive обязателен");
		});

		it("should return error if isActive is null", () => {
			const result = validateProductCreationAttributes({ ...validProduct, isActive: null });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("isActive обязателен");
		});

		it("should return error if isActive is not boolean", () => {
			const result = validateProductCreationAttributes({ ...validProduct, isActive: "true" });
			expect(result.isValid).toBe(false);
			expect(result.error).toBe("isActive должен быть булевым значением");
		});

		it("should return success", () => {
			const result = validateProductCreationAttributes({
				...validProduct,
				isActive: true,
			});
			expect(result.isValid).toBe(true);
			expect(result.product).toEqual({ ...validProduct, isActive: true });
		});
	});

	it("should return success for valid product", () => {
		const result = validateProductCreationAttributes(validProduct);
		expect(result.isValid).toBe(true);
		expect(result.product).toEqual(validProduct);
	});
});

