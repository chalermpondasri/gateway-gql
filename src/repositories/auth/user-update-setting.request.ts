import {
    Locale,
    SubtitleSelection,
} from '@/types/enums/locales.enum'

export class UpdateUserDeviceSettingRequest  {
    public deviceLocale: Locale
    public notificationAllowPush: boolean
    public notificationAllowNewRelease: boolean
    public notificationAllowNewsAndPromotions: boolean
    public pbAutoAdjustQuality: boolean
    public pbAutoPlayNext: boolean
    public pbAutoPlayTrailer: boolean
    public pbNetworkThrottlingMode: boolean
    public pbWarnOnCellular: boolean
    public pbWifiOnly: boolean
    public videoSubtitle: typeof SubtitleSelection
}