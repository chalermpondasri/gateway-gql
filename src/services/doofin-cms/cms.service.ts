import {
    Inject,
    Injectable,
    Logger,
    LoggerService,
    UnauthorizedException,
} from '@nestjs/common'
import {
    map,
    mergeMap,
    Observable,
    of,
    throwError,
} from 'rxjs'
import { ICmsRepository } from '@/repositories/cms'
import { BaseRequest } from '@/repositories/cms/base.request'
import { ProviderName } from '@/constants/provider-name.const'
import { TermType } from '@/types/objects'
import { response } from 'express'
import {
    CmsRoleType,
    CmsUserType,
} from '@/types/objects/cms.type'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'

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

    public localeManagerLogin(identity: string, password: string): Observable<CmsUserType> {
        return this._cmsRepository.login(identity, password).pipe(
            mergeMap( loginResponse => {
                return this._cmsRepository.getUserData(loginResponse.user.id).pipe(
                    map(userData => {
                        return {loginResponse, userData}
                    })
                )
            }),
            mergeMap( ({loginResponse, userData}) => {
                if(!userData?.role?.type || userData?.role?.type !== 'locale_manager') {
                    return throwError(() => new UnauthorizedException('Unauthorized'))
                }

                const cmsUser = plainToInstance(CmsUserType, instanceToPlain(loginResponse.user))
                cmsUser.role = plainToInstance(CmsRoleType, instanceToPlain(userData.role))
                cmsUser.jwt = loginResponse.jwt
                return of(cmsUser)
            })
        )

    }

}