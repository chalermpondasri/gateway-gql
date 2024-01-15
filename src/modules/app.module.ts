import {
    ApolloDriver,
    ApolloDriverConfig,
} from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { GlobalModule } from '@/modules/global.module'
import { CmsModule } from '@/modules/cms.module'
import { AuthModule } from '@/modules/auth.module'
import { ConfigModule } from '@nestjs/config'
import { SearchModule } from '@/modules/search.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        GlobalModule,
        CmsModule,
        AuthModule,
        SearchModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            installSubscriptionHandlers: true,
            playground: process.env.NODE_ENV !== 'production' ? {
                endpoint: '/graphql',
                settings: {
                    'request.credentials': 'include',
                },
            } : false,
            context: ({ req }) => ({ req }),
        }),
    ],
})
export class AppModule {
}
