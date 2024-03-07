import { Observable } from 'rxjs'

export interface IPaymentRepository {
    createPaymentToken(): Observable<{ transactionToken: string }>
    checkoutPackage(packageId: number, transactionToken: string): Observable<{ packageId: number, total: number }>
}