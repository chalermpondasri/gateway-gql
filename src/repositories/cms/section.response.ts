import { CmsImageContent } from '@/repositories/cms/promotional.response'
import { BaseResponse } from '@/repositories/cms/base.response'
export class EpisodeResponse {
    public id: number
    public duration: number
    public episodeName: string
    public coverImage: { data: BaseResponse<CmsImageContent>}
    public order: number
}
export class ExternalContent {
    public id: number
    public url: string
    public mimeType?: string

}
export class SectionItemResponse {
    public id: number
    public title: string
    public contentRating: string
    public episodes: EpisodeResponse[]
    public link?: ExternalContent
    public trailer?: ExternalContent
    public shortVideo?: ExternalContent
    public tags: string
    public coverImage: { data: BaseResponse<CmsImageContent>}
}

export class SectionResponse {
    public sectionTitle: string
    public sectionSubtitle?: string
    public sectionType: string
    public sectionLink?: string
    public order: number
    public sectionItems: SectionItemResponse[]

}