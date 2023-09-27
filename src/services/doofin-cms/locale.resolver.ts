import {
    Args,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { CmsUserType } from '@/types/objects/cms.type'

@Resolver()
export class LocaleResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService,
    ) {
    }

    @Query(type => CmsUserType)
    public localeManagerLogin(
        @Args({name: 'username', type:()=>String!}) username: string,
        @Args({name: 'password', type:()=>String!}) password: string,
    ) {
        return this._cmsService.localeManagerLogin(username, password)
    }
}