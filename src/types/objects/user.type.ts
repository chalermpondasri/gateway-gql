import {
    Field,
    GraphQLISODateTime,
    ID,
    Int,
    ObjectType,
} from '@nestjs/graphql'
import {
    ProfileType,
} from '@/types/objects/profile.type'
import { IdStringType } from '@/types/objects/id-string.type'
import { DeviceSessionType } from '@/types/objects/device-session.type'
import {
    Locale,
    SubtitleSelection,
} from '@/types/enums/locales.enum'

@ObjectType()
export class BaseUserType {
    @Field(() => ID)
    public userId: string

    @Field()
    public status: string
}

@ObjectType()
export class CreateUserResponseType extends BaseUserType {
    @Field()
    public email: string

    @Field()
    public otpToken: string
}

@ObjectType()
export class LocalizationSettingType {
    @Field(() => Locale)
    public deviceLocale: Locale
}
@ObjectType()
export class NotificationSettingType {
    @Field()
    public allowPushNotification: boolean
    @Field()
    public newRelease: boolean
    @Field()
    public newsAndPromotions: boolean

}
@ObjectType()
export class PlaybackSettingType {
    @Field({description: 'Adjust streaming quality according to network connection'})
    public autoAdjustQuality: boolean
    @Field({description: 'allow playback when using wifi only'})
    public wifiOnly: boolean
    @Field({description: 'allow warning message when try to play on cellular'})
    public warnOnCellular: boolean
    @Field({description: 'limit network usage by reducing video quality and disable some network consumption features'})
    public networkThrottlingMode: boolean
    @Field({description: 'auto play trailer when available'})
    public autoPlayTrailer: boolean
    @Field({description: 'auto play next video in queue'})
    public autoPlayNext: boolean
}

@ObjectType()
export class VideoSettingType {
    @Field(() => SubtitleSelection)
    public subtitle: typeof SubtitleSelection
}

@ObjectType()
export class UserSettingType {
    @Field(() =>  LocalizationSettingType)
    public localizationSetting: LocalizationSettingType
    @Field(() => NotificationSettingType)
    public notificationSetting: NotificationSettingType
    @Field(() => PlaybackSettingType)
    public playbackSetting: PlaybackSettingType
    @Field(() => VideoSettingType)
    public videoSetting: VideoSettingType
}
@ObjectType()
export class UserType extends IdStringType {
    @Field()
    public email: string

    @Field()
    public verifiedPhoneNumber: string

    @Field()
    public status: string

    @Field()
    public emailVerificationStatus: string

    @Field({deprecationReason: 'Moved to profile instead'})
    public dob: string

    @Field(() => [ProfileType])
    public profiles: [ProfileType]

    @Field(() => [DeviceSessionType])
    public deviceSessions: [DeviceSessionType]

    @Field(() => UserSettingType)
    public setting: UserSettingType
}

@ObjectType()
export class UserRequestOtpType {
    @Field()
    public referenceNumber: string

    @Field(() => Int)
    public remaining: number

    @Field(() => GraphQLISODateTime)
    public expiredAt: Date

    @Field()
    public token: string
}

@ObjectType()
export class UserVerifyOtpType {
    @Field(() => Boolean)
    public status: boolean
}

@ObjectType()
export class UserRequestEmailType {
    @Field()
    public referenceNumber: string

    @Field(() => GraphQLISODateTime)
    public expiredAt: Date

    @Field()
    public token: string
}
