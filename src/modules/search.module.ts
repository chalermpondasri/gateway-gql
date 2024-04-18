import { Module } from '@nestjs/common'
import { searchRepositoryProvider } from '@/providers/search.provider'
import { SearchService } from '@/services/search/services/search.service'
import { authRepositoryProvider } from '@/providers/auth.provider'
import { SearchResolver } from '@/services/search/resolvers/search.resolver'

@Module({
    providers: [
        searchRepositoryProvider,
        authRepositoryProvider,
        SearchService,
        SearchResolver,
    ],
    exports: [ SearchService ],
})
export class SearchModule {}