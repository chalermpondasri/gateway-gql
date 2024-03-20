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

    public checkoutPackage(packageId: number, transactionToken: string): Observable<{ packageId: number; total: number }> {
        const promise = this._axiosInstance.patch(`/payments/transaction`, {packageId, transactionToken})
        return from(promise).pipe(map( ({data}) => data))
    }

    public rent(mediaId: number, episodeId: number): Observable<{ success: boolean, remainCoin: number }> {
        return from(this._axiosInstance.post(`/payments/rent`, {mediaId, episodeId})).pipe(
            map( response => response.data)
        )

    }
}