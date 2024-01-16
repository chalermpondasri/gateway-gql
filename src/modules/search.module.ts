import { Module } from '@nestjs/common'
import { searchRepositoryProvider } from '@/providers/search.provider'
import { SearchService } from '@/services/search/services/search.service'
import { authRepositoryProvider } from '@/providers/auth.provider'
import { SearchContentResolver } from '@/services/search/search-content.resolver'
import { CmsModule } from './cms.module'

@Module({
    providers: [
        searchRepositoryProvider,
        authRepositoryProvider,
        SearchService,
        SearchContentResolver
    ],
    imports: [ CmsModule ],
})
export class SearchModule {}