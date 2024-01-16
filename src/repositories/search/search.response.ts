import { 
CmsImageContent,
LocaleTextResponse,
} from "../cms"

export class SearchMediaContentResonse {
    public id: number
    public title: LocaleTextResponse
    public subtitle?: LocaleTextResponse
    public slug: string
    public createdAt: Date
    public updatedAt: Date
    public publishedAt: Date
    public mediaTags: string[]
    public coverImage: CmsImageContent
    public rating: string
}