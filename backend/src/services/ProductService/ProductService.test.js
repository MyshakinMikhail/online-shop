import { Op } from "sequelize";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Product } from "../../models/index.ts";
import {
	mockProduct,
	mockProducts
} from "./../../mocks/products/index.ts";
import { ProductService } from "./ProductService";

vi.mock("../../models/index.ts", () => ({
	Product: {
		create: vi.fn(),
		update: vi.fn(),
		destroy: vi.fn(),
		findByPk: vi.fn(),
		findOne: vi.fn(),
		findAll: vi.fn(),
		findAndCountAll: vi.fn(),
	},
}));

describe("ProductService", () => {
	describe("getProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns product when model resolves successfully", async () => {
			const id = 1;
			const returnedProduct = mockProduct;

			Product.findByPk.mockResolvedValue(returnedProduct);

			const result = await ProductService.getProduct(id);

			expect(Product.findByPk).toHaveBeenCalledWith(id);
			expect(result).toBe(returnedProduct);
		});

		it("returns null when model returns null", async () => {
			const id = 1;
			Product.findByPk.mockResolvedValue(null);

			const result = await ProductService.getProduct(id);

			expect(Product.findByPk).toHaveBeenCalledWith(id);
			expect(result).toEqual(null);
		});
	});

	describe("getProductByName", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("return product when model resolved successfully", async () => {
			const productName = "Test Product";
			const returnedProduct = mockProduct;

			Product.findOne.mockResolvedValue(returnedProduct);

			const result = await ProductService.getProductByName(productName);

			expect(Product.findOne).toHaveBeenCalledWith({ where: { name: productName } });
			expect(result).toBe(returnedProduct);
		});

		it("return null when model returns null", async () => {
			const productName = "Test Product";

			Product.findOne.mockResolvedValue(null);

			const result = await ProductService.getProductByName(productName);

			expect(Product.findOne).toHaveBeenCalledWith({ where: { name: productName } });
			expect(result).toBe(null);
		});
	});

	describe("getProductByArticle", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns product when model resolved successfuly", async () => {
			const product = mockProduct;
			const article = "Test article";

			Product.findOne.mockResolvedValue(product);

			const result = await ProductService.getProductByArticle(article);

			expect(Product.findOne).toHaveBeenCalledWith({ where: { article } });
			expect(result).toBe(product);
		});

		it("returns null when model returns null", async () => {
			const article = "Test article";

			Product.findOne.mockResolvedValue(null);

			const result = await ProductService.getProductByArticle(article);

			expect(Product.findOne).toHaveBeenCalledWith({ where: { article } });
			expect(result).toBe(null);
		});
	});

	describe("searchProductsByName", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns products when model works correctly", async () => {
			const searchParam = "Футболка";
			const returnedProducts = [mockProduct];

			Product.findAll.mockResolvedValue(returnedProducts);

			const result = await ProductService.searchProductsByName(searchParam);

			expect(Product.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [
						{
							name: { [Op.iLike]: `%${searchParam}%` },
							isActive: true,
						},
					],
				},
				order: [["name", "ASC"]],
			});
			expect(result).toBe(returnedProducts);
		});

		it("returns empty array when model returns empty array", async () => {
			const searchParam = "Футболки";
			Product.findAll.mockResolvedValue([]);

			const result = await ProductService.searchProductsByName(searchParam);

			expect(Product.findAll).toHaveBeenCalledWith({
				where: {
					[Op.or]: [
						{
							name: { [Op.iLike]: `%${searchParam}%` },
							isActive: true,
						},
					],
				},
				order: [["name", "ASC"]],
			});
			expect(result).toEqual([]);
		});
	});

	describe("getActiveProductsPage", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns active products when model works correctly", async () => {
			const page = 1;
			const limit = 25;
			const whereClause = { isActive: true, categoryId: 1 };

			const returned = { count: mockProducts.length, rows: mockProducts };
			Product.findAndCountAll.mockResolvedValue(returned);

			const result = await ProductService.getActiveProductsPage({ page, limit, whereClause });

			expect(Product.findAndCountAll).toHaveBeenCalledWith({
				where: whereClause,
				limit,
				offset: (page - 1) * limit,
				order: [["name", "ASC"]],
			});
			expect(result).toBe(returned);
		});

		it("returns empty result when model returns empty result", async () => {
			const page = 1;
			const limit = 25;
			const whereClause = { isActive: true, categoryId: 1 };

			const returned = { count: 0, rows: [] };
			Product.findAndCountAll.mockResolvedValue(returned);

			const result = await ProductService.getActiveProductsPage({ page, limit, whereClause });
			expect(Product.findAndCountAll).toHaveBeenCalledWith({
				where: whereClause,
				limit,
				offset: (page - 1) * limit,
				order: [["name", "ASC"]],
			});
			expect(result).toBe(returned);
		});
	});

	describe("createProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns created product when model resolves successfully", async () => {
			const product = mockProduct;

			const createdProduct = { id: 1, ...product };

			Product.create.mockResolvedValue(createdProduct);

			const result = await ProductService.createProduct(product);

			expect(Product.create).toHaveBeenCalledWith(product);
			expect(result).toEqual(createdProduct);
		});

		it("returns null when model returns null", async () => {
			const product = mockProduct;

			Product.create.mockResolvedValue(null);
			const result = await ProductService.createProduct(product);

			expect(Product.create).toHaveBeenCalledWith(product);
			expect(result).toEqual(null);
		});
	});

	describe("updateProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns affectedCount when model resolves successfully", async () => {
			const product = mockProduct;

			Product.update.mockResolvedValue([1]);

			const [affectedCount] = await ProductService.updateProduct(product);

			expect(Product.update).toHaveBeenCalledWith(product, { where: { id: product.id } });
			expect(affectedCount).toEqual(1);
		});

		it("returns null when model returns null", async () => {
			const product = mockProduct;

			Product.update.mockResolvedValue(null);

			const result = await ProductService.updateProduct(product);
			expect(Product.update).toHaveBeenCalledWith(product, { where: { id: product.id } });
			expect(result).toEqual(null);
		});
	});

	describe("deleteProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns number of affected rows when model resolves successfully", async () => {
			const id = 1;

			Product.destroy.mockResolvedValue(1);

			const result = await ProductService.deleteProduct(id);

			expect(Product.destroy).toHaveBeenCalledWith({ where: { id } });
			expect(result).toBe(1);
		});

		it("returns error when validation is not success", async () => {
			const id = 1;

			Product.destroy.mockResolvedValue(null);

			const result = await ProductService.deleteProduct(id);

			expect(Product.destroy).toHaveBeenCalledWith({ where: { id } });
			expect(result).toEqual(null);
		});
	});

	describe("deleteAllProducts", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it("returns count of removed rows when model works correctly", async () => {
			const products = mockProducts;

			Product.destroy.mockResolvedValue(products.length);

			const result = await ProductService.deleteAllProducts();

			expect(Product.destroy).toHaveBeenCalledWith({ where: {} });
			expect(result).toBe(products.length);
		});

		it("returns null when model returns null", async () => {
			Product.destroy.mockResolvedValue(null);

			const result = await ProductService.deleteAllProducts();

			expect(Product.destroy).toHaveBeenCalledWith({ where: {} });
			expect(result).toBe(null);
		});
	});
});
