import {
    Inject,
    Injectable,
    Logger,
    LoggerService
} from '@nestjs/common'
import {
    map,
    Observable
} from 'rxjs'
import { ICmsRepository } from '@/repositories/cms'
import { BaseRequest } from '@/repositories/cms/base.request'
import { ProviderName } from '@/constants/provider-name.const'
import { TermType } from '@/types/objects'

@Injectable()
export class CmsService {

    private readonly _logger: LoggerService
    constructor(
        @Inject(ProviderName.CMS_REPOSITORY)
        private readonly _cmsRepository: ICmsRepository,
    ) {
        this._logger = new Logger(this.constructor.name)
    }

    public getLatestTerms(): Observable<TermType> {
        const request = new BaseRequest()
        request.sortMeta = {
            'publishedAt': 'desc',
        }
        return this._cmsRepository.getTermsAndConditions(request).pipe(
            map(({data, meta}) => {
                const {id, attributes} = data[0]
                return {
                    id,
                    createdAt: attributes.createdAt,
                    publishedAt: attributes.publishedAt,
                    updatedAt: attributes.updatedAt,
                    th: attributes.th,
                    en: attributes.en,
                }
            })
        )
    }

}