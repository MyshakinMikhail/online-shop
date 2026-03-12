import {
	Product,
	type ProductAttributes,
	type ProductCreationAttributes,
} from "../../models/Product.ts";

export const ProductService = {
	getProduct: async (id: number) => {
		return await Product.findByPk(id);
	},
	createProduct: async (product: ProductCreationAttributes) => {
		return await Product.create(product);
	},
	updateProduct: async (product: ProductAttributes) => {
		return await Product.update(product, {
			where: { id: product.id },
		});
	},
	deleteProduct: async (id: number) => {
		return await Product.destroy({ where: { id } });
	},
};
