export class BaseProfileResponse {
    public id: string
    public name: string
    public avatar: number
    public audienceLevel: string
}

export class ProfileResponse extends BaseProfileResponse {
    public dob: string
    public categories: string[]
    public contentRating: string
    public pinSettingStatus: string
}
