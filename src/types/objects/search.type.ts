import {  Field, ObjectType,PickType } from '@nestjs/graphql';
import { MediaContentDetailType, MediaContentType } from './section.type';

@ObjectType()
export class SearchContentType extends PickType(MediaContentType,['id','coverImage','contentRating','title','tags','trailers']) {
    @Field()
    public mediaContentDetail?: MediaContentDetailType
}