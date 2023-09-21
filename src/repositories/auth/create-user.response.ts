export class BaseUserResponse {
    public userId: string
    public status: string
}
export class CreateUserResponse extends BaseUserResponse{
    public email: string
    public otpToken: string
}

export class VerifyEmailUserResponse  {
    public id: string
    public email: string
    public name?: string
    public dob: string
    public status: string
}