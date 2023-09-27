export class ListResponse<T>{
    public data: T[]
    public meta: ResponseMeta
}

export class ResponseMeta {
    public pagination: PaginationMeta
}

export class PaginationMeta {
    public page: number
    public pageSize: number
    public pageCount: number
    public total: number
}