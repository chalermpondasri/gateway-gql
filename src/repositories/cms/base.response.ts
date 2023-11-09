
export class BaseAttribute {
    public id: number
    public createdAt: string
    public updatedAt: string
}

export class BaseResponse<T> {
    public id: number
    public attributes: BaseAttribute & T
}

export class CmsDataResponse<T> {
    public data: BaseResponse<T> | BaseResponse<T>[]
}
