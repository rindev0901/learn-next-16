import { Pagination } from "@/schemas/pagination";

type DataPagination<T> = {
	data: T[];
	paging: Pagination;
}

export type { DataPagination };
