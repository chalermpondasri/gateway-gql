import {
    Query,
    Resolver,
} from '@nestjs/graphql'
import { CoinPackageType } from '@/types/objects'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'

@Resolver(() => CoinPackageType)
export class CoinPackageResolver {
    public constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService
    ) {

    }

    @Query(() => [CoinPackageType])
    public getCoinPackages() {
        return this._cmsService.getCoinPackages()
    }
}