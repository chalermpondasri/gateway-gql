import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import {
    CreateLocaleRequest,
    ILocaleRepository,
    PaginationQueryRequest,
} from '@/repositories/auth'
import {
    CreateLocaleLabelInput,
    UpdateLocaleLabelInput,
} from '@/types/inputs'
import {
    map,
    Observable,
} from 'rxjs'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'
import {
    LocaleListType,
    LocaleType,
    LocalizedKeyLabelType,
} from '@/types/objects'
import { PaginationInput } from '@/types/inputs/pagination.input'
import { IdStringType } from '@/types/objects/id-string.type'

@Injectable()
export class LocaleService {
    public constructor(
        @Inject(ProviderName.LOCALE_REPOSITORY)
        private readonly _localeRepository: ILocaleRepository
    ) {
    }

    private _extractJwt(token = ''){
        return token.substring(token.indexOf(' ')+1)
    }

    public createNewLocale(input: CreateLocaleLabelInput, token: string): Observable<IdStringType> {
        const request = plainToInstance(CreateLocaleRequest, instanceToPlain(input))
        return this._localeRepository.createLabel(this._extractJwt(token),request).pipe(
            map(data => {
                const result = new IdStringType()
                result.id = data.id
                return result
            })
        )
    }

    public getLocale(id: string, token: string): Observable<LocaleType> {
        return this._localeRepository.getById(this._extractJwt(token), id).pipe(
            map( data => {
                return plainToInstance(LocaleType, instanceToPlain(data))
            })
        )
    }

    public getLocales(query: string, pagination: PaginationInput, token: string): Observable<LocaleListType> {
        const queryRequest = new PaginationQueryRequest()
        if(!!pagination) {
            queryRequest.limit = pagination.limit
            queryRequest.page = pagination.page
            queryRequest.query = query
        }

        return this._localeRepository.listLabels(this._extractJwt(token), queryRequest).pipe(
            map(result => {
                return plainToInstance(LocaleListType, instanceToPlain(result))
            })
        )
    }

    public deleteLocale(id: string, token: string): Observable<LocaleType> {
        return this._localeRepository.deleteLabel(this._extractJwt(token), id).pipe(
            map( data => {
                return plainToInstance(LocaleType, instanceToPlain(data))
            })
        )
    }

    public patchLocale(id: string, payload: UpdateLocaleLabelInput, token: string): Observable<LocaleType> {
        return this._localeRepository.updateLabel(this._extractJwt(token), id, payload).pipe(
            map( data => {
                return plainToInstance(LocaleType, instanceToPlain(data))
            })
        )
    }

    public getLocalesByCode(localeKey: string): Observable<LocalizedKeyLabelType[]> {
        return this._localeRepository.listLocalizedKeyLabel(localeKey).pipe(
            map(data => {
                return plainToInstance(LocalizedKeyLabelType, instanceToPlain(data.data) as unknown[])
            })
        )
    }

}