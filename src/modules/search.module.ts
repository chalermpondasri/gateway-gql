import { Module } from '@nestjs/common'
import { searchRepositoryProvider } from '@/providers/search.provider'
import { SearchService } from '@/services/search/services/search.service'
import { authRepositoryProvider } from '@/providers/auth.provider'

@Module({
    providers: [
        searchRepositoryProvider,
        authRepositoryProvider,
        SearchService,
    ],
    exports: [SearchService],
})
export class SearchModule {}