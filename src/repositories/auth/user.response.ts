export class OtpChangePhoneResponse {
    public referenceNumber: string
    public remaining: number
    public expiredAt: Date
    public token: string
}