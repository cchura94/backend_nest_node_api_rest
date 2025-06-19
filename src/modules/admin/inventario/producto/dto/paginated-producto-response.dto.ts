import { ProductoResponseDto } from "./producto-response.dto";

export class PaginatedProductoResponseDto{
    data: ProductoResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    search?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    almacen?: number;
    activo?: boolean
}