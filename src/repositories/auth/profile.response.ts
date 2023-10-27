import { Transform } from "class-transformer"

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

export class ProfileRequestResetPinResponse {
    public token: string
    @Transform(({value})=> !!value ? new Date(value) : null)
    public expiredAt: Date
}


export class MyListResponse {
    public programId: string
    @Transform(({value})=> !!value? new Date(value): null)
    public addDate: string
}