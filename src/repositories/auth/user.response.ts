export class OtpChangePhoneResponse {
    public referenceNumber: string
    public remaining: number
    public expiredAt: Date
    public token: string
}

export class OtpVerifyPhoneResponse {
    public status: boolean
}
