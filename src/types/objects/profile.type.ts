import { 
    Field, 
    ObjectType 
} from '@nestjs/graphql';
import { IdStringType } from './id-string.type';
import {
    BaseProfileResponse,
    ProfileResponse,
} from '@/repositories/auth'


@ObjectType()
export class BaseProfileType extends IdStringType implements BaseProfileResponse {
    @Field()
    public name: string
    @Field()
    public avatar: string
    @Field()
    public audienceLevel: string
}

@ObjectType()
export class ProfileType extends BaseProfileType implements ProfileResponse {
    @Field()
    public dob: string
    @Field(()=> [String])
    public categories: string[]
    @Field()
    public contentRating: string
    @Field()
    public pinSettingStatus: string
}

@ObjectType()
export class ProfileHasAccountInformationType extends ProfileType {
    @Field()
    public email: string

    @Field()
    public phoneNumber: string

    @Field()
    public emailVerificationStatus: string
}