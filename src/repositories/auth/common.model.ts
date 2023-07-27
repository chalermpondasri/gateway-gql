
export class LocaleLabel {
    public en: string
    public th: string
    public cn?: string
}

export class IdResponse {
    public id: string
}

export class PaginationRequest {
    public limit = 20
    public page = 1
}

export class PaginationQueryRequest extends PaginationRequest{
    public query?: string
}