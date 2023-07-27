import {
    ApolloDriver,
    ApolloDriverConfig
} from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { GlobalModule } from '@/modules/global.module'
import { CmsModule } from '@/modules/cms.module'
import { AuthModule } from '@/modules/auth.module'

@Module({
    imports: [
        GlobalModule,
        CmsModule,
        AuthModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            installSubscriptionHandlers: true,
            playground: process.env.NODE_ENV !== 'production',
            context: ({req}) => ({req})
        }),
    ],
})
export class AppModule {}
