import {
    Field,
    InputType,
} from '@nestjs/graphql'
import {
    Locale,
    SubtitleSelection,
} from '@/types/enums/locales.enum'
import { 
    FileUpload, 
    GraphQLUpload, 
} from 'graphql-upload-ts'

@InputType()
export class UserVerifyOtpInput {
    @Field({ nullable: false })
    public token: string

    @Field({ nullable: false })
    public referenceNumber: string

    @Field({ nullable: false })
    public otpCode: string
}

@InputType()
export class UserChangePasswordInput {
    @Field({ nullable: false })
    public oldPassword: string

    @Field({ nullable: false })
    public newPassword: string
}

@InputType()
export class UserSettingInput {
    @Field(() => Locale, { nullable: true })
    public lzDeviceLocale: Locale
    @Field({nullable: true})
    public notificationAllowPush: boolean
    @Field({nullable: true})
    public notificationNewRelease: boolean
    @Field({nullable: true})
    public notificationNewsAndPromotions: boolean
    @Field({nullable: true})
    public pbAutoAdjustQuality: boolean
    @Field({nullable: true})
    public pbWifiOnly: boolean
    @Field({nullable: true})
    public pbWarnOnCellular: boolean
    @Field({nullable: true})
    public pbNetworkThrottlingMode: boolean
    @Field({nullable: true})
    public pbAutoPlayTrailer: boolean
    @Field({nullable: true})
    public pbAutoplayNext: boolean
    @Field(() => SubtitleSelection,{nullable: true})
    public videoSubtitle: typeof SubtitleSelection
}

@InputType()
export class ContactSupportInput {
    @Field()
    public faqTitleId: string
    @Field()
    public faqSubTitle: string
    @Field()
    public email: string
    @Field()
    public phoneNumber: string
    @Field()
    public detail: string
    @Field(()=> GraphQLUpload)
    public image1: FileUpload
    //! i have been trying to use [GraphQLUpload] all day but it doesn't work and i don't know
    @Field(()=> GraphQLUpload, {nullable: true})
    public image2: FileUpload
    @Field(()=> GraphQLUpload, {nullable: true})
    public image3: FileUpload
}