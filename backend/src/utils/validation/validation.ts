import type { ProductCreationAttributes } from "../../models/Product.ts";

export interface UserIdValidationResult {
	isValid: boolean;
	error?: string;
	userId?: number;
}

export interface ProductValidationResult {
	isValid: boolean;
	error?: string;
	productId?: number;
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
	promocode?: string;
}

export interface PromocodeDiscountValidationResult {
	isValid: boolean;
	error?: string;
	discount?: number;
}

export const validateUserId = (userId: number | string | undefined): UserIdValidationResult => {
	if (!userId) {
		return {
			isValid: false,
			error: "userId is required",
		};
	}

	if (isNaN(Number(userId))) {
		return {
			isValid: false,
			error: "userId must be a number",
		};
	}

	const numericUserId = Number(userId);
	if (numericUserId <= 0) {
		return {
			isValid: false,
			error: "userId must be a positive number",
		};
	}

	return { isValid: true, userId: numericUserId };
};

export const validateProductId = (
	productId: number | string | undefined
): ProductValidationResult => {
	if (!productId) {
		return {
			isValid: false,
			error: "productId is required",
		};
	}
	if (isNaN(Number(productId))) {
		return {
			isValid: false,
			error: "productId must be a number",
		};
	}
	const numericProductId = Number(productId);
	if (numericProductId <= 0) {
		return {
			isValid: false,
			error: "productId must be a positive number",
		};
	}
	return { isValid: true, productId: numericProductId };
};

export const validateCategorySlug = (slug: string | undefined): CategorySlugValidationResult => {
	if (!slug) {
		return { isValid: false, error: "slug is required" };
	}
	if (typeof slug !== "string") {
		return { isValid: false, error: "slug must be a string" };
	}
	const trimmedSlug = slug.trim();
	if (trimmedSlug.length === 0) {
		return { isValid: false, error: "slug must be a non-empty string" };
	}
	return { isValid: true, slug: trimmedSlug };
};

export const validatePromocode = (promocode: string | undefined): PromocodeValidationResult => {
	if (!promocode) {
		return {
			isValid: false,
			error: "promocode is required",
		};
	}

	if (typeof promocode !== "string") {
		return {
			isValid: false,
			error: "promocode must be a string",
		};
	}

	const normalizedPromocode = promocode.trim()
	if (normalizedPromocode.length === 0) {
		return {
			isValid: false,
			error: "promocode must be a non-empty string",
		};
	}

	return { isValid: true, promocode: normalizedPromocode };
};

export const validatePromocodeDiscount = (
	discount: number | string | undefined
): PromocodeDiscountValidationResult => {
	if (discount === undefined || discount === null || discount === "") {
		return { isValid: true, discount: 0 };
	}
	if (isNaN(Number(discount))) {
		return {
			isValid: false,
			error: "discount must be a number",
		};
	}

	const numericDiscount = Number(discount);
	if (!Number.isInteger(numericDiscount)) {
		return {
			isValid: false,
			error: "discount must be an integer",
		};
	}
	if (numericDiscount < 0 || numericDiscount > 100) {
		return {
			isValid: false,
			error: "discount must be between 0 and 100",
		};
	}

	return { isValid: true, discount: numericDiscount };
};

export const validateProductCreationAttributes = (
	product: ProductCreationAttributes | undefined
): ProductCreationAttributesValidationResult => {
	// Проверка наличия объекта
	if (!product || typeof product !== "object") {
		return { isValid: false, error: "product is required" };
	}

	// Валидация name (обязательное поле)
	if (!product.name || typeof product.name !== "string") {
		return { isValid: false, error: "product name is required and must be a string" };
	}
	const trimmedName = product.name.trim();
	if (trimmedName.length === 0) {
		return { isValid: false, error: "product name cannot be empty" };
	}
	if (trimmedName.length < 3) {
		return { isValid: false, error: "product name must be at least 3 characters long" };
	}
	if (trimmedName.length > 200) {
		return { isValid: false, error: "product name must not exceed 200 characters" };
	}

	// Валидация description (обязательное поле)
	if (!product.description || typeof product.description !== "string") {
		return { isValid: false, error: "product description is required and must be a string" };
	}
	const trimmedDescription = product.description.trim();
	if (trimmedDescription.length === 0) {
		return { isValid: false, error: "product description cannot be empty" };
	}
	if (trimmedDescription.length < 10) {
		return { isValid: false, error: "product description must be at least 10 characters long" };
	}
	if (trimmedDescription.length > 5000) {
		return { isValid: false, error: "product description must not exceed 5000 characters" };
	}

	// Валидация sizes (обязательное поле, массив)
	if (!product.sizes || !Array.isArray(product.sizes)) {
		return { isValid: false, error: "product sizes is required and must be an array" };
	}
	if (product.sizes.length === 0) {
		return { isValid: false, error: "product must have at least one size" };
	}
	// Проверяем, что все элементы массива - строки
	const invalidSizes = product.sizes.some(
		(currSize: string) => typeof currSize !== "string" || currSize.trim().length === 0
	);
	if (invalidSizes) {
		return { isValid: false, error: "all sizes must be non-empty strings" };
	}

	// Валидация article (обязательное поле)
	if (typeof product.article !== "string") {
		return { isValid: false, error: "product article is required and must be a string" };
	}
	// может быть пустым, артикул генерится на бэке

	// Валидация price (обязательное поле, положительное число)
	if (product.price === undefined || product.price === null) {
		return { isValid: false, error: "product price is required" };
	}
	if (typeof product.price !== "number" || isNaN(product.price)) {
		return { isValid: false, error: "product price must be a valid number" };
	}
	if (product.price <= 0) {
		return { isValid: false, error: "product price must be a positive number" };
	}
	if (!Number.isInteger(product.price)) {
		return { isValid: false, error: "product price must be an integer" };
	}

	// Валидация categoryId (обязательное поле, положительное целое число)
	if (product.categoryId === undefined || product.categoryId === null) {
		return { isValid: false, error: "product categoryId is required" };
	}
	if (typeof product.categoryId !== "number" || isNaN(product.categoryId)) {
		return { isValid: false, error: "product categoryId must be a valid number" };
	}
	if (product.categoryId <= 0) {
		return { isValid: false, error: "product categoryId must be a positive number" };
	}
	if (!Number.isInteger(product.categoryId)) {
		return { isValid: false, error: "product categoryId must be an integer" };
	}

	// Валидация stock (обязательное поле, неотрицательное целое число)
	if (product.stock === undefined || product.stock === null) {
		return { isValid: false, error: "product stock is required" };
	}
	if (typeof product.stock !== "number" || isNaN(product.stock)) {
		return { isValid: false, error: "product stock must be a valid number" };
	}
	if (product.stock < 0) {
		return { isValid: false, error: "product stock cannot be negative" };
	}
	if (!Number.isInteger(product.stock)) {
		return { isValid: false, error: "product stock must be an integer" };
	}

	// Валидация isActive (обязательное поле, boolean)
	if (product.isActive === undefined || product.isActive === null) {
		return { isValid: false, error: "product isActive is required" };
	}
	if (typeof product.isActive !== "boolean") {
		return { isValid: false, error: "product isActive must be a boolean" };
	}

	// Все проверки пройдены
	return { isValid: true, product };
};
