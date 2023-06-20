import {
    Query,
    Resolver
} from '@nestjs/graphql'
import { Term } from '@/services/doofin-cms/models/term.model'
import { Inject } from '@nestjs/common'
import { CmsService } from '@/services/doofin-cms/cms.service'
import { Observable } from 'rxjs'

@Resolver(of => Term)
export class CmsResolver {

    constructor(
        @Inject(CmsService)
        private readonly _cmsService: CmsService
    ) {
    }

    @Query( returns => Term)
    public getLatestTerm(): Observable<Term> {
        return this._cmsService.getLatestTerms()
    }
}