import { z } from "zod";

export const ProductsQuerySchema = z.object({
	category: z.enum(["all", "tShirts", "hoodies", "longSleeves", "trousers"]),
});

export type ProductsQuery = z.infer<typeof ProductsQuerySchema>;
