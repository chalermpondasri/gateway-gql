import { Observable } from 'rxjs';

export interface IByteArkRepository {
    uploadFile(imgName: string, file: Buffer): Observable<string>
    generateOriginalUrlToSignedUrl(urls: string[], expiresIn: number): Observable<string[]>
}