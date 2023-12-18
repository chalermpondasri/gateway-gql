import {
    Transform,
    Type,
} from 'class-transformer'

export class OtpChangePhoneResponse {
    public referenceNumber: string
    public remaining: number
    @Transform(v => v.value ? new Date(v.value) : null)
    public expiredAt: Date
    public token: string
}

export class OtpVerifyPhoneResponse {
    public status: boolean
}


interface INotificationSetting {
    newRelease: boolean
    newsAndPromotions: boolean
    allowPushNotification: boolean
}
interface ILocalizationSetting {
    deviceLocale: string
}

interface IPlaybackSetting {
    wifiOnly: boolean
    warnOnCellular: boolean
    autoAdjustQuality: boolean
    networkThrottlingMode: boolean
    autoPlayTrailer: boolean
    autoPlayNext: boolean
}

interface IVideoSetting {
    subtitle: string
}

export class DeviceSettingResponse {
    public localizationSetting: ILocalizationSetting
    public notificationSetting: INotificationSetting
    public playbackSetting: IPlaybackSetting
    public videoSetting: IVideoSetting
}

export class UserResponse {
    public id: string
    public email: string
    public status: string
    public emailVerificationStatus: string
    public verifiedPhoneNumber: string

    @Type(()=>DeviceSettingResponse)
    public setting: DeviceSettingResponse
}

export class UserWhoForgotPasswordResponse {
    public userId: string
    public verifiedPhone: boolean
    public verifiedEmail: boolean
}
