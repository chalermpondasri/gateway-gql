export class BaseUserResponse {
    public userId: string
    public status: string
}
export class CreateUserResponse extends BaseUserResponse{
    public email: string
    public otpToken: string
}