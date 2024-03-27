import { MediaContentType } from '@/types/objects/section.type'
import {
    Field,
    ObjectType,
} from '@nestjs/graphql'
import { Paginated } from '@/types/objects/abstract.type'

@ObjectType()
export class LatestSubscriptionType {
    @Field(() => MediaContentType)
    public mediaContent: MediaContentType
    @Field()
    public totalSubscribedEpisodes: number
}


@ObjectType()
export class PaginatedLatestSubscriptionType extends Paginated(LatestSubscriptionType) {}