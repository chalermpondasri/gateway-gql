import { Expose } from 'class-transformer'
import { ReadStream } from 'fs'

interface IContactImages {
    readStream: ReadStream
    fileName: string
    mimetype: string
}
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
    public images: Array<IContactImages>
}