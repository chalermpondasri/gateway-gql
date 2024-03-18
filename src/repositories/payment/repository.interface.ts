import { Observable } from 'rxjs'
import { ListResponse } from '@/models/common'
import { PaymentResponse } from '@/repositories/payment/payment.response'

export interface IPaymentRepository {
    getPaymentHistory(page: number, limit: number): Observable<ListResponse<PaymentResponse>>
    createPaymentToken(): Observable<{ transactionToken: string }>
    checkoutPackage(packageId: number, transactionToken: string): Observable<{ packageId: number, total: number }>
}