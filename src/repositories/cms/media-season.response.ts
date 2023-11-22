import { LocaleTextResponse } from '@/repositories/cms/locale-text.response'
import { CmsDataResponse } from '@/repositories/cms/base.response'
import { MediaEpisodeResponse } from '@/repositories/cms/media-episode.response'

export class MediaSeasonResponse {
    public slug: string
    public name: LocaleTextResponse
    public ordering: number
    public mediaEpisodes: CmsDataResponse<MediaEpisodeResponse>
}