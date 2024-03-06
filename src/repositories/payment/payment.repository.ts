import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { AxiosInstance } from 'axios'

export class PaymentRepository implements IPaymentRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance
    ) {
    }
    public createPaymentToken(): Observable<{ transactionToken: string }> {
        const promise = this._axiosInstance.post(`/payments/transaction`)
        return from(promise).pipe(
            map( response => response.data)
        )
    }
}