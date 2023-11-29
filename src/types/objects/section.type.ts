import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'
import {
    CmsImageType,
    IdType,
} from '@/types/objects/cms.type'
import { LocalizedLabelType } from '@/types/objects/label.type'
import { MediaSeasonType } from '@/types/objects/media-season.type'
import { Transform } from 'class-transformer'

@ObjectType()
export class ExternalContentType {
    @Field()
    public url: string
    @Field({nullable: true})
    public mimeType?: string
}
@ObjectType()
export class BaseEpisodeType extends IdType {
    @Field()
    public order: number
    @Field({nullable: true})
    public duration: string
    @Field({nullable: true})
    public episodeName: string
    @Field(() => CmsImageType)
    public coverImage: CmsImageType
    @Field()
    public continueWatchingAt: number

}
@ObjectType()
export class EpisodeItemType extends BaseEpisodeType {

}

@ObjectType()
export class MediaEpisodeType extends BaseEpisodeType {
    @Field(() => [String])
    public audio: string[]
    @Field(() => [String])
    public captions: string[]
}

@ObjectType()
export class MediaContentType extends IdType{
    @Field({nullable: true})
    public title: string
    @Field()
    public contentRating: string
    @Field(() => [ExternalContentType])
    public shortVideos: ExternalContentType[]
    @Field(() => [ExternalContentType])
    public trailers: ExternalContentType[]
    @Field(() => CmsImageType, {nullable: true})
    public coverImage: CmsImageType
    @Field(() => ExternalContentType, { nullable: true})
    public link: ExternalContentType
    @Field(() => [LocalizedLabelType])
    public tags: LocalizedLabelType[]
    @Field(() => [EpisodeItemType], { nullable: true, deprecationReason: 'move to season'})
    public episodes: EpisodeItemType[]
    @Field()
    public isSeries: boolean
    @Field()
    public totalEpisode: number
    @Field()
    public totalSeason: number
}
@ObjectType()
export class SectionItemType extends MediaContentType {
    @Field()
    public recentlyPublished: boolean
}

@ObjectType()
export class MediaContentDetailType extends MediaContentType {
    @Field()
    public subtitle: string
    @Field(() => [String])
    public captions: string[]
    @Field(() => [String])
    public audios: string[]

    @Field(() => [MediaSeasonType])
    public seasons: MediaSeasonType[]
}

@ObjectType()
export class SectionType extends IdType {
    @Field()
    public sectionTitle: string
    @Field({nullable: true})
    public sectionSubtitle: string
    @Field()
    public sectionType: string
    @Field({nullable: true})
    public sectionLink: string
    @Field(() => GraphQLISODateTime)
    @Transform(v => v.value ? new Date(v.value) : null)
    public createdAt: Date
    @Field(() => GraphQLISODateTime)
    @Transform(v => v.value ? new Date(v.value) : null)
    public updatedAt: Date
    @Field()
    public order: number
    @Field(() => [SectionItemType])
    public sectionItems: SectionItemType[]
    @Field(() => CmsImageType, { nullable: true})
    public coverImage: CmsImageType
}