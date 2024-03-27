import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'
import { Paginated } from '@/types/objects/abstract.type'

@ObjectType()
export class CoinConsumptionHistoryType {
    @Field()
    public id: string
    @Field()
    public contentId: number
    @Field()
    public episodeId: number
    @Field()
    public coinSpent: number
    @Field(() => GraphQLISODateTime)
    public rentAt: Date

    @Field()
    public contentTitle: string
    @Field()
    public episodeTitle: string

}


@ObjectType()
export class PaginatedCoinConsumptionHistory extends Paginated(CoinConsumptionHistoryType) {}
