import { Observable } from 'rxjs'
import { ListResponse } from '@/models/common'
import { PaymentResponse } from '@/repositories/payment/payment.response'
import { SubscriptionResponse } from '@/repositories/payment/subscriptions.response'
import { LatestSubscriptionResponse } from '@/repositories/payment/latest-subscription.response'

export interface IPaymentRepository {
    getLatestSubscriptions(page: number,limit: number): Observable<ListResponse<LatestSubscriptionResponse>>
    getPaymentHistory(page: number, limit: number): Observable<ListResponse<PaymentResponse>>
    createPaymentToken(): Observable<{ transactionToken: string }>
    checkoutPackage(packageId: number, transactionToken: string): Observable<{ packageId: number, total: number }>
    rent(mediaId: number, episodeId: number): Observable<{ success: boolean, remainCoin: number }>
    getSubscribeContents(): Observable<SubscriptionResponse[]>
}