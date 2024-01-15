export class ListResponse<T> {
    public total: number
    public limit: number
    public page: number
    public data: T[]
}