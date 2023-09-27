export class BaseProfileResponse {
    public id: string
    public name: string
    public avatar: string
    public audienceLevel: string
}

export class ProfileResponse extends BaseProfileResponse {
    public dob: string
    public categories: string[]
    public contentRating: string
    public pinSettingStatus: string
}

export class ProfileHasAccountInformationResponse extends ProfileResponse {
    public email: string
    public phoneNumber: string
    public emailVerificationStatus: string
}