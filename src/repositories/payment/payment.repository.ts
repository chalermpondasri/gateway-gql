import { IPaymentRepository } from '@/repositories/payment/repository.interface'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import { AxiosInstance } from 'axios'
import { ListResponse } from '@/models/common'
import { PaymentResponse } from '@/repositories/payment/payment.response'
import { plainToInstance } from 'class-transformer'

export class PaymentRepository implements IPaymentRepository {
    public constructor(
        private readonly _axiosInstance: AxiosInstance,
    ) {
    }

    public getPaymentHistory(page: number, limit: number): Observable<ListResponse<PaymentResponse>> {
        return from(this._axiosInstance.get(`/payments`, { data: { page, limit } })).pipe(
            map(response => response.data),
            map(responsePayload => {
                const result = plainToInstance(ListResponse<PaymentResponse>, responsePayload)
                result.data = plainToInstance(PaymentResponse, result.data)
                return result
            }),
        )
    }

    public createPaymentToken(): Observable<{ transactionToken: string }> {
        const promise = this._axiosInstance.post(`/payments/transaction`)
        return from(promise).pipe(
            map(response => response.data),
        )
    }

    public checkoutPackage(packageId: number, transactionToken: string): Observable<{
        packageId: number;
        total: number
    }> {
        const promise = this._axiosInstance.patch(`/payments/transaction`, { packageId, transactionToken })
        return from(promise).pipe(map(({ data }) => data))
    }

    public rent(mediaId: number, episodeId: number): Observable<{ success: boolean, remainCoin: number }> {
        return from(this._axiosInstance.post(`/payments/rent`, {mediaId, episodeId})).pipe(
            map( response => response.data)
        )

    }
}