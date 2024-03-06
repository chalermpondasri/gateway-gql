import { Observable } from 'rxjs'

export interface IPaymentRepository {
    createPaymentToken(): Observable<{ transactionToken: string }>
}