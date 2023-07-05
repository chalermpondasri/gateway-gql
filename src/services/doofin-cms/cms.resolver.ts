import {
    Query,
    Resolver
} from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { Observable } from 'rxjs'
import { TermType } from '@/types/objects'

@Resolver(of => TermType)
export class CmsResolver {

    constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService
    ) {
    }

    @Query( returns => TermType)
    public getLatestTerm(): Observable<TermType> {
        return this._cmsService.getLatestTerms()
    }
}