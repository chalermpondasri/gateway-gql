import { LocaleTextResponse } from '@/repositories/cms/locale-text.response'
import {
    CmsDataResponse,
} from '@/repositories/cms/base.response'
import { CmsImageContent } from '@/repositories/cms/promotional.response'
import { TagResponse } from '@/repositories/cms/tag.response'

export class PredefinedSearchResponse {
    public expanded: boolean
    public url: string
    public title: LocaleTextResponse
    public coverImage: CmsDataResponse<CmsImageContent>
    public order: number
    public type: 'generic' | 'collection'
    public includeTags: CmsDataResponse<TagResponse>
    public excludeTags: CmsDataResponse<TagResponse>
}