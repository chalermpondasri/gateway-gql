import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import {
    CreateLocaleRequest,
    ILocaleRepository,
} from '@/repositories/auth'
import {
    CreateLocaleLabelInput,
    UpdateLocaleLabelInput,
} from '@/types/inputs'
import {
    map,
    Observable,
} from 'rxjs'
import { IdType } from '@/types/objects/id.type'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import { LocaleType } from '@/types/objects'

@Injectable()
export class LocaleService {
    constructor(
        @Inject(ProviderName.LOCALE_REPOSITORY)
        private readonly _localeRepository: ILocaleRepository
    ) {
    }

    private extractJwt(token: string = ''){
        return token.substring(token.indexOf(' ')+1)
    }

    public createNewLocale(input: CreateLocaleLabelInput, token: string): Observable<IdType> {
        const request = plainToInstance(CreateLocaleRequest, instanceToPlain(input))
        return this._localeRepository.createLabel(this.extractJwt(token),request).pipe(
            map(data => {
                const result = new IdType()
                result.id = data.id
                return result
            })
        )
    }

    public getLocale(id: string, token: string): Observable<LocaleType> {
        return this._localeRepository.getById(this.extractJwt(token), id).pipe(
            map( data => {
                return plainToInstance(LocaleType, instanceToPlain(data))
            })
        )
    }

    public deleteLocale(id: string, token: string): Observable<LocaleType> {
        return this._localeRepository.deleteLabel(this.extractJwt(token), id).pipe(
            map( data => {
                return plainToInstance(LocaleType, instanceToPlain(data))
            })
        )
    }

    public patchLocale(id: string, payload: UpdateLocaleLabelInput, token: string): Observable<LocaleType> {
        return this._localeRepository.updateLabel(this.extractJwt(token), id, payload).pipe(
            map( data => {
                return plainToInstance(LocaleType, instanceToPlain(data))
            })
        )
    }

}