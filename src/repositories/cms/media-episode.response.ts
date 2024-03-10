import { LocaleTextResponse } from '@/repositories/cms/locale-text.response'
import { CmsImageContent } from '@/repositories/cms/promotional.response'
import {
    CmsDataResponse,
    KeyValueResponse,
} from '@/repositories/cms/base.response'
import { MediaDurationResponse } from '@/repositories/cms/media-duration.response'
import { MediaPriceDetail } from '@/repositories/cms/media-price.response'

export class MediaEpisodeResponse {
    public slug: string
    public name: LocaleTextResponse
    public duration: MediaDurationResponse
    public ordering: number
    public coverImage: CmsDataResponse<CmsImageContent>
    public audio: KeyValueResponse[]
    public subtitle: KeyValueResponse[]
    public videoId: string
    public price: CmsDataResponse<MediaPriceDetail>
}