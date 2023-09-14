export class BaseProfileRespose {
    public id: string
    public name: string
    public avatar: string
    public audienceLevel: string
}

export class ProfileRespose extends BaseProfileRespose {
    public dob: string
    public categories: string[]
    public contentRating: string
}

export class ProfileHasAccountInformationResponse extends ProfileRespose {
    public email: string
    public phoneNumber: string
    public emailVerificationStatus: string
}