import { beforeEach, describe, expect, it, vi } from "vitest";
import { Product } from "../../models/Product.ts";
import { ProductService } from "./ProductService";

vi.mock("../../models/Product.ts", () => ({
	Product: {
		create: vi.fn(),
		update: vi.fn(),
		destroy: vi.fn(),
		findByPk: vi.fn(),
	},
}));

describe("ProductService", () => {
	describe("createProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});
	
		it("returns created product when model resolves successfully", async () => {
			const product = {
				name: "Test Product",
				description: "Test Description",
				sizes: ["S", "M", "L"],
				article: "TEST-123",
				price: 100,
				categoryId: 1,
				stock: 10,
				isActive: true,
			}
			
			const createdProduct = {id: 1, ...product};

			Product.create.mockResolvedValue(createdProduct);
	
			const result = await ProductService.createProduct(product);
	
			expect(Product.create).toHaveBeenCalledWith(product);
			expect(result).toEqual(createdProduct);
		});

		it("returns null when model returns null", async () => {
			const product = {
				name: "Test Product",
				description: "Test Description",
				sizes: ["S", "M", "L"],
				article: "TEST-123",
				price: 100,
				categoryId: 1,
				stock: 10,
				isActive: true,
			}

			Product.create.mockResolvedValue(null)
			const result = await ProductService.createProduct(product);

			expect(Product.create).toHaveBeenCalledWith(product);
			expect(result).toEqual(null);
		});
	});

	describe("updateProduct", () => {
		beforeEach(()=>{
			vi.clearAllMocks();
		})

		it("returns affectedCount when model resolves successfully", async () => {
			const product = {
				id: 1,
				name: "Test Product",
				description: "Test Description",
				sizes: ["S", "M", "L"],
				article: "TEST-123",
				price: 100,
				categoryId: 1,
				stock: 10,
				isActive: true,
				image_url: "https://example.com/image.jpg",
				images: ["https://example.com/image.jpg", "https://example.com/image2.jpg"],
			}
			
			Product.update.mockResolvedValue([1]);

			const [ affectedCount ] = await ProductService.updateProduct(product);

			expect(Product.update).toHaveBeenCalledWith(product, {where: {id: product.id}});
			expect(affectedCount).toEqual(1);
		});

		it ("returns null when model returns null", async() => {
			const product = {
				id: 1,
				name: "Test Product",
				description: "Test Description",
				sizes: ["S", "M", "L"],
				article: "TEST-123",
				price: 100,
				categoryId: 1,
				stock: 10,
				isActive: true,
				image_url: "https://example.com/image.jpg",
				images: ["https://example.com/image.jpg", "https://example.com/image2.jpg"],
			}

			Product.update.mockResolvedValue(null);

			const result = await ProductService.updateProduct(product)
			expect(Product.update).toHaveBeenCalled()
			expect(result).toEqual(null)

		})
	})

	describe("deleteProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks()
		})

		it("returns number of affected rows when model resolves successfully", async() => {
			const id = 1;

			Product.destroy.mockResolvedValue(1);

			const result = await ProductService.deleteProduct(id);

			expect(Product.destroy).toHaveBeenCalledWith({where: {id}})
			expect(result).toBe(1)
			
		})

		it("returns error when validation is not success", async() => {
			const id = 1;
			
			Product.destroy.mockResolvedValue(null)

			const result = await ProductService.deleteProduct(id)

			expect(Product.destroy).toHaveBeenCalled();
			expect(result).toEqual(null)
		})
	})
	
	describe("getProduct", () => {
		beforeEach(() => {
			vi.clearAllMocks()
		})

		it("returns product when model resolves successfully", async() => {
			const id = 1;

			const returnedProduct = {
				id: 1,
				name: "Test Product",
				description: "Test Description",
				sizes: ["S", "M", "L"],
				article: "TEST-123",
				price: 100,
				categoryId: 1,
				stock: 10,
				isActive: true,
				image_url: "https://example.com/image.jpg",
				images: ["https://example.com/image.jpg", "https://example.com/image2.jpg"],
			}


			Product.findByPk.mockResolvedValue(returnedProduct)

			const result = await ProductService.getProduct(id)

			expect(Product.findByPk).toHaveBeenCalledWith(id)
			expect(result).toBe(returnedProduct)
		})

		it("returns null when model returns null", async() => {
			const id = 1;

			Product.findByPk.mockResolvedValue(null)

			const result = await ProductService.getProduct(id);

			expect(Product.findByPk).toHaveBeenCalled()
			expect(result).toEqual(null)
		})
	})
});