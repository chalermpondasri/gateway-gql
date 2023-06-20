export class BaseResponse<T>{
    data: T[]
    meta: ResponseMeta
}

export class ResponseMeta {
    public pagination: PaginationMeta
}

export class PaginationMeta {
    public start: number
    public limit: number
    public total: number
}