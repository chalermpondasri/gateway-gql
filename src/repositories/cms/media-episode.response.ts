import { LocaleTextResponse } from '@/repositories/cms/locale-text.response'
import { CmsImageContent } from '@/repositories/cms/promotional.response'
import { CmsDataResponse } from '@/repositories/cms/base.response'

export class MediaEpisodeResponse {
    public slug: string
    public name: LocaleTextResponse
    public duration: number
    public ordering: number
    public coverImage: CmsDataResponse<CmsImageContent>
}