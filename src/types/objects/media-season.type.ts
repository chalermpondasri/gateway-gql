import { IdStringType } from '@/types/objects/id-string.type'
import {
    Field,
    ObjectType,
} from '@nestjs/graphql'
import {
    MediaEpisodeType,
} from '@/types/objects'

@ObjectType()
export class MediaSeasonType extends IdStringType {
    @Field()
    public slug: string
    @Field()
    public name: string
    @Field()
    public ordering: number
    @Field(() => [MediaEpisodeType])
    public mediaEpisodes: MediaEpisodeType[]
}