import type { Product } from "./product";

export type CreateProductType = Omit<Product, "id">;
