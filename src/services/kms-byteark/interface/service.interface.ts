import { Observable } from 'rxjs'

export interface IByteArkTokenPayload {
    content_id?: string
    tech?: string
    definition?: string
}

export interface IKMSByteArkService {
    getKeyEncode(secret: string, jwtToken: string): Observable<string>

    getKeyPlayer(secret: string, jwtToken: string): Observable<string>
}
