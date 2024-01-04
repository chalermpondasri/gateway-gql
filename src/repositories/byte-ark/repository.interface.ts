import { Observable } from "rxjs";

export interface IByteArkRepository {
    uploadFile(imgName: string, file: Buffer): Observable<any>
}