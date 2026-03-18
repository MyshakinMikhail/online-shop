import { Op } from "sequelize";
import { type ProductAttributes, type ProductCreationAttributes } from "../../models/Product.ts";

import { Product } from "../../models/index.ts";

type WhereClauseType = {
	isActive: boolean;
	categoryId?: number;
};

export const ProductService = {
	getProduct: async (id: number) => {
		return await Product.findByPk(id);
	},
	getProductByName: async (name: string) => {
		return await Product.findOne({ where: { name } });
	},
	getProductByArticle: async (article: string) => {
		return await Product.findOne({ where: { article } });
	},
	searchProductsByName: async (searchQuery: string) => {
		return await Product.findAll({
			where: {
				[Op.or]: [
					{
						name: { [Op.iLike]: `%${searchQuery}%` },
						...{ isActive: true },
					},
				],
			},
			order: [["name", "ASC"]],
		});
	},
	getActiveProductsPage: async (params: {
		page: number;
		limit: number;
		whereClause: WhereClauseType;
	}) => {
		const { page, limit, whereClause } = params;

		return await Product.findAndCountAll({
			where: whereClause,
			limit,
			offset: (page - 1) * limit,
			order: [["name", "ASC"]],
		});
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
	deleteAllProducts: async () => {
		return await Product.destroy({ where: {} });
	},
};
