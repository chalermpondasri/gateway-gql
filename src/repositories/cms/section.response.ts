import { CmsImageContent } from '@/repositories/cms/promotional.response'
import {
    CmsDataResponse,
} from '@/repositories/cms/base.response'
import { LocaleTextResponse } from '@/repositories/cms/locale-text.response'
import { MediaContentResponse } from '@/repositories/cms/media-content.response'
export class EpisodeResponse {
    public id: number
    public duration: number
    public episodeName: string
    public coverImage: CmsDataResponse<CmsImageContent>
    public order: number
}
export class ExternalContent {
    public id: number
    public url: string
    public mimeType?: string
}

export class SectionResponse {
    public title: LocaleTextResponse
    public subtitle?: LocaleTextResponse
    public sectionType: string
    public sectionLink?: string
    public order: number
    public items: CmsDataResponse<MediaContentResponse>
    public coverImage: CmsDataResponse<CmsImageContent>

}