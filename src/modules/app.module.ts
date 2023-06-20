import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GlobalModule } from '@/modules/global.module'
import { CmsModule } from '@/modules/cms.module'

@Module({
    imports: [
        GlobalModule,
        CmsModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            installSubscriptionHandlers: true,
            playground: process.env.NODE_ENV !== 'production'
        }),
    ],
})
export class AppModule {}
