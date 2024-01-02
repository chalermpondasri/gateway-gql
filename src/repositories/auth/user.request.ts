import { ImgCache } from '@/services/cache/interface/service.interface'
import { Expose } from 'class-transformer'

export class ContactSupportRequest {
    @Expose()
    public faqTitleId: string
    @Expose()
    public faqSubTitle: string
    @Expose()
    public email: string
    @Expose()
    public phoneNumber: string
    @Expose()
    public detail: string
    public imgCache: ImgCache[]
}