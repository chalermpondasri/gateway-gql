import { Observable } from 'rxjs'

export interface IPaymentRepository {
    createPaymentToken(): Observable<{ transactionToken: string }>
    checkoutPackage(packageId: number, transactionToken: string): Observable<{ packageId: number, total: number }>
    rent(mediaId: number, episodeId: number): Observable<{ success: boolean, remainCoin: number }>
}