import { Type } from 'class-transformer'
import {
    IdResponse,
    LocaleLabel,
} from '@/models/common/common.model'


export class LocaleResponse extends IdResponse{
    public key: string
    @Type(() => LocaleLabel)
    public labels: LocaleLabel
}

export class LocalizedKeyLabelResponse {
    public key: string
    public label: string
}
