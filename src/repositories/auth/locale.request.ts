import { LocaleLabel } from '@/models/common/common.model'
import { Type } from 'class-transformer'

export class CreateLocaleRequest {
    public key: string
    @Type(() => LocaleLabel)
    public labels: LocaleLabel
}

export class UpdateLocaleRequest extends CreateLocaleRequest {}