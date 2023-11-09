import { LocaleTextResponse } from '@/repositories/cms/locale-text.response'
import { ExternalContent } from '@/repositories/cms/section.response'
import { CmsDataResponse } from '@/repositories/cms/base.response'
import { CmsImageContent } from '@/repositories/cms/promotional.response'
import { PersonResponse } from '@/repositories/cms/person.response'
import { TagResponse } from '@/repositories/cms/tag.response'
import { MediaEpisodeResponse } from '@/repositories/cms/media-episode.response'
import { ContentRatingResponse } from '@/repositories/cms/content-rating.response'

export class MediaContentResponse {
    public title: LocaleTextResponse
    public subtitle: LocaleTextResponse
    public trailers: ExternalContent[]
    public coverImage: CmsDataResponse<CmsImageContent>
    public link: ExternalContent
    public casts: CmsDataResponse<PersonResponse>
    public directors: CmsDataResponse<PersonResponse>
    public mediaTags: CmsDataResponse<TagResponse>
    public media_episodes: CmsDataResponse<MediaEpisodeResponse>
    public rating: CmsDataResponse<ContentRatingResponse>

}