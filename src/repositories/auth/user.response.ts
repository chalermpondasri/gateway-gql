export class OtpChangePhoneResponse {
    public referenceNumber: string
    public remaining: number
    public expiredAt: Date
    public token: string
}

export class OtpVerifyPhoneResponse {
    public status: boolean
}


export class UserResponse {
    public id: string
    public email: string
    public status: string
    public emailVerificationStatus: string
    public verifiedPhoneNumber: string
}