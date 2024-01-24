import { PersonType } from '@/types/objects'
import { 
CmsImageContent,
    ExternalContent,
LocaleTextResponse,
} from '../cms'

export class SearchMediaContentResonse {
    public id: number
    public title: LocaleTextResponse
    public subtitle?: LocaleTextResponse
    public slug: string
    public createdAt: Date
    public updatedAt: Date
    public publishedAt: Date
    public mediaTags: LocaleTextResponse[]
    public coverImage: CmsImageContent
    public rating: string
    public trailers: ExternalContent[]
    public directors: PersonType[]
    public casts: PersonType[]
    public link: ExternalContent
}