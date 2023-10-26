import { 
    Field, 
    GraphQLISODateTime, 
    ObjectType 
} from '@nestjs/graphql';
import { UserType } from './user.type';
import { ProfileType } from './profile.type';

@ObjectType()
class SubListType {
    @Field()
    public programId:string

    @Field(()=> GraphQLISODateTime)
    public addDate:Date
}

@ObjectType()
export class MyListType{
    @Field(()=> UserType)
    public user:UserType

    @Field(() => ProfileType)
    public profile:ProfileType

    @Field(()=> [SubListType])
    public subList: SubListType[]
}