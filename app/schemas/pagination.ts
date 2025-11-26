import { z } from "zod";

const pagingSchema = z.object({
	currentPage: z.coerce.number().min(1).catch(1),
	pageSize: z.coerce.number().min(1).max(10).catch(10),
	totalPages: z.coerce.number().optional(),
	totalItems: z.coerce.number().min(0).optional(),
});

type Pagination = z.infer<typeof pagingSchema>;

export { pagingSchema, type Pagination };
