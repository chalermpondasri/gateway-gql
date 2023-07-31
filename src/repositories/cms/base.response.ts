import { ResponseMeta } from '@/repositories/cms/list.response'

export class BaseAttribute {
    public id: number
    public createdAt: string
    public updatedAt: string
}

export class BaseResponse<T> {
    public id: number
    public attributes: BaseAttribute & T
}
