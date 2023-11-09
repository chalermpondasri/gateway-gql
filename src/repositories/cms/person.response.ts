import {
    CmsDataResponse,
} from '@/repositories/cms/base.response'
import { CmsImageContent } from '@/repositories/cms/promotional.response'

export class PersonResponse {
    public name: string
    public portrait: CmsDataResponse<CmsImageContent>
}