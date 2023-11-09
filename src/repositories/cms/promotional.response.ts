import {
    CmsDataResponse,
} from '@/repositories/cms/base.response'

export class PromotionalResponse {
    public titleEn: string
    public titleTh: string
    public descriptionEn: string
    public descriptionTh: string
    public imageWeb: CmsDataResponse<CmsImageContent>
    public imageMobile: CmsDataResponse<CmsImageContent>
}

export class CmsImageContent {
    public name: string
    public alternativeText?: string
    public caption?: string
    public width: number
    public height: number
    public formats: {
        large: CmsImageFormat,
        small: CmsImageFormat,
        medium: CmsImageFormat,
        thumbnail: CmsImageFormat,
    }
    public hash: string
    public ext: string
    public mime: string
    public size: number
    public url: string
    public previewUrl?: string
    public provider: string
    public provider_metadata: unknown

}

export class CmsImageFormat {
    public ext: string
    public url: string
    public hash: string
    public mime: string
    public name: string
    public path?: string
    public size: number
    public width: number
    public height: number
}