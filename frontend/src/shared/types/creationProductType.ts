import { type Product } from "@/shared/types";

export type CreationProductType = Omit<Product, "id">;
