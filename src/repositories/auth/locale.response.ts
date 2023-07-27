import { Type } from 'class-transformer'
import {
    IdResponse,
    LocaleLabel,
} from '@/repositories/auth/common.model'


export class LocaleResponse extends IdResponse{
    public key: string
    @Type(() => LocaleLabel)
    public labels: LocaleLabel
}
