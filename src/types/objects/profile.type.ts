import { 
    Field, 
    GraphQLISODateTime, 
    ObjectType, 
} from '@nestjs/graphql';
import { IdStringType } from './id-string.type';
import { AvatarType } from './cms.type';
import { UserType } from './user.type';
import { Expose } from 'class-transformer';
import { SectionItemType } from './section.type';


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
    @Field(()=> [String])
    public categories: string[]
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
    @Expose({ name: 'programId' })
    public mediaId:string

    @Field(()=> GraphQLISODateTime)
    public addDate:Date

    @Field(()=> SectionItemType)
    public mediaContent: SectionItemType
}

