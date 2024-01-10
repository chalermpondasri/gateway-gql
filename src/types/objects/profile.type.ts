import { 
    Field, 
    GraphQLISODateTime, 
    ObjectType, 
} from '@nestjs/graphql';
import { IdStringType } from './id-string.type';
import { AvatarType } from './cms.type';
import { UserType } from './user.type';
import { MediaContentDetailType } from './section.type';
import { CategoryType } from './category.type';


@ObjectType()
export class BaseProfileType extends IdStringType  {
    @Field()
    public name: string
    @Field(()=> AvatarType)
    public avatar: AvatarType
    @Field()
    public audienceLevel: string
}

@ObjectType()
export class ProfileType extends BaseProfileType  {
    @Field()
    public dob: string
    @Field(()=> [CategoryType])
    public categories: CategoryType[]
    @Field()
    public contentRating: string
    @Field()
    public pinSettingStatus: string
    @Field(()=> UserType)
    public userAccount: UserType
    @Field(()=> [MyListType])
    public myList: MyListType[]
}

@ObjectType()
export class ValidateProfilePinType {
    @Field()
    public isValid: boolean
}

@ObjectType()
export class ProfileRequestResetPinType {
    @Field()
    public token: string
    @Field(() => GraphQLISODateTime )
    public expiredAt: Date
}

@ObjectType()
export class MyListType{
    @Field()
    public programId:string

    @Field(()=> GraphQLISODateTime)
    public addDate:Date

    @Field(()=> MediaContentDetailType)
    public mediaContent: MediaContentDetailType
}

