import { ProductAttributes } from "../../models/Product";

export const mockProduct: ProductAttributes = {
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
};
