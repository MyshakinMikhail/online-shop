import type { ProductCreationAttributes } from "../../models/Product.ts";

export interface IdValidationResult {
	isValid: boolean;
	error?: string;
	id?: number;
}

export interface CategorySlugValidationResult {
	isValid: boolean;
	error?: string;
	slug?: string;
}

export interface ProductCreationAttributesValidationResult {
	isValid: boolean;
	error?: string;
	product?: ProductCreationAttributes;
}

export interface PromocodeValidationResult {
	isValid: boolean;
	error?: string;
	name?: string;
}

export interface PromocodeDiscountValidationResult {
	isValid: boolean;
	error?: string;
	discount?: number;
}

export const validateId = (id: number | string | undefined): IdValidationResult => {
	if (!id) {
		return {
			isValid: false,
			error: "id обязателен",
		};
	}

	if (isNaN(Number(id))) {
		return {
			isValid: false,
			error: "id должен быть числом",
		};
	}

	const numericId = Number(id);
	if (numericId <= 0) {
		return {
			isValid: false,
			error: "id должен быть положительным числом",
		};
	}

	if (!Number.isInteger(numericId)) {
		return {
			isValid: false,
			error: "id должен быть целым числом",
		};
	}

	return { isValid: true, id: numericId };
};

export const validateCategorySlug = (slug: string | undefined): CategorySlugValidationResult => {
	if (!slug) {
		return { isValid: false, error: "slug обязателен" };
	}
	if (typeof slug !== "string") {
		return { isValid: false, error: "slug должен быть строкой" };
	}
	const trimmedSlug = slug.trim();
	if (trimmedSlug.length === 0) {
		return { isValid: false, error: "slug не может быть пустой строкой" };
	}

	return { isValid: true, slug: trimmedSlug };
};

export const validatePromocodeName = (name: string | undefined): PromocodeValidationResult => {
	if (!name) {
		return {
			isValid: false,
			error: "Название промокода обязательно",
		};
	}

	if (typeof name !== "string") {
		return {
			isValid: false,
			error: "Название промокода должно быть строкой",
		};
	}

	const normalizedPromocode = name.trim();
	if (normalizedPromocode.length === 0) {
		return {
			isValid: false,
			error: "Название промокода не может быть пустой строкой",
		};
	}

	return { isValid: true, name: normalizedPromocode };
};

export const validatePromocodeDiscount = (
	discount: number | undefined
): PromocodeDiscountValidationResult => {
	if (discount === undefined || discount === null) {
		return { isValid: false, error: "Скидка обязательна" };
	}
	if (typeof discount !== "number") {
		return {
			isValid: false,
			error: "Скидка должна быть числом",
		};
	}

	const numericDiscount = Number(discount);
	if (!Number.isInteger(numericDiscount)) {
		return {
			isValid: false,
			error: "Скидка должна быть целым числом",
		};
	}
	if (numericDiscount < 0 || numericDiscount > 100) {
		return {
			isValid: false,
			error: "Скидка должна быть в диапазоне от 0 до 100",
		};
	}

	return { isValid: true, discount: numericDiscount };
};

export const validateProductCreationAttributes = (
	product: ProductCreationAttributes | undefined
): ProductCreationAttributesValidationResult => {
	// Проверка наличия объекта
	if (!product) {
		return { isValid: false, error: "Объект продукта обязателен" };
	}
	if (typeof product !== "object") {
		return { isValid: false, error: "Продукт должен быть объектом" };
	}

	// Валидация name (обязательное поле)
	if (!product.name || typeof product.name !== "string") {
		return { isValid: false, error: "Название продукта обязательно и должно быть строкой" };
	}
	const trimmedName = product.name.trim();
	if (trimmedName.length === 0) {
		return { isValid: false, error: "Название продукта не может быть пустым" };
	}
	if (trimmedName.length < 3) {
		return { isValid: false, error: "Название продукта должно содержать минимум 3 символа" };
	}
	if (trimmedName.length > 200) {
		return { isValid: false, error: "Название продукта не должно превышать 200 символов" };
	}

	// Валидация description (обязательное поле)
	if (!product.description || typeof product.description !== "string") {
		return { isValid: false, error: "Описание продукта обязательно и должно быть строкой" };
	}
	const trimmedDescription = product.description.trim();
	if (trimmedDescription.length === 0) {
		return { isValid: false, error: "Описание продукта не может быть пустым" };
	}
	if (trimmedDescription.length < 10) {
		return { isValid: false, error: "Описание продукта должно содержать минимум 10 символов" };
	}
	if (trimmedDescription.length > 5000) {
		return { isValid: false, error: "Описание продукта не должно превышать 5000 символов" };
	}

	// Валидация sizes (обязательное поле, массив)
	if (!product.sizes || !Array.isArray(product.sizes)) {
		return { isValid: false, error: "Размеры продукта обязательны и должны быть массивом" };
	}
	if (product.sizes.length === 0) {
		return { isValid: false, error: "У продукта должен быть хотя бы один размер" };
	}
	// Проверяем, что все элементы массива - строки
	const invalidSizes = product.sizes.some(
		(currSize: string) => typeof currSize !== "string" || currSize.trim().length === 0
	);
	if (invalidSizes) {
		return { isValid: false, error: "Все размеры должны быть непустыми строками" };
	}

	// Валидация article (обязательное поле)
	if (typeof product.article !== "string") {
		return { isValid: false, error: "Артикул продукта обязателен и должен быть строкой" };
	}
	// может быть пустым, артикул генерится на бэке

	// Валидация price (обязательное поле, положительное число)
	if (product.price === undefined || product.price === null) {
		return { isValid: false, error: "Цена продукта обязательна" };
	}
	if (typeof product.price !== "number" || isNaN(product.price)) {
		return { isValid: false, error: "Цена продукта должна быть корректным числом" };
	}
	if (product.price <= 0) {
		return { isValid: false, error: "Цена продукта должна быть положительным числом" };
	}
	if (!Number.isInteger(product.price)) {
		return { isValid: false, error: "Цена продукта должна быть целым числом" };
	}

	// Валидация categoryId (обязательное поле, положительное целое число)
	if (product.categoryId === undefined || product.categoryId === null) {
		return { isValid: false, error: "categoryId обязателен" };
	}
	if (typeof product.categoryId !== "number" || isNaN(product.categoryId)) {
		return { isValid: false, error: "categoryId должен быть корректным числом" };
	}
	if (product.categoryId <= 0) {
		return { isValid: false, error: "categoryId должен быть положительным числом" };
	}
	if (!Number.isInteger(product.categoryId)) {
		return { isValid: false, error: "categoryId должен быть целым числом" };
	}

	// Валидация stock (обязательное поле, неотрицательное целое число)
	if (product.stock === undefined || product.stock === null) {
		return { isValid: false, error: "Количество товара на складе обязательно" };
	}
	if (typeof product.stock !== "number" || isNaN(product.stock)) {
		return {
			isValid: false,
			error: "Количество товара на складе должно быть корректным числом",
		};
	}
	if (product.stock < 0) {
		return { isValid: false, error: "Количество товара на складе не может быть отрицательным" };
	}
	if (!Number.isInteger(product.stock)) {
		return { isValid: false, error: "Количество товара на складе должно быть целым числом" };
	}

	// Валидация isActive (обязательное поле, boolean)
	if (product.isActive === undefined || product.isActive === null) {
		return { isValid: false, error: "isActive обязателен" };
	}
	if (typeof product.isActive !== "boolean") {
		return { isValid: false, error: "isActive должен быть булевым значением" };
	}

	// Все проверки пройдены
	return { isValid: true, product };
};
