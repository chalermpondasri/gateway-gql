import { Observable } from 'rxjs'
import { BytearkPlayerType } from '@/types/objects/byteark-player.type'

export interface IByteArkTokenPayload {
    content_id?: string
    tech?: string
    definition?: string
}

export interface IKMSByteArkService {
    getKeyEncode(secret: string, jwtToken: string): Observable<string>

    getKeyPlayer(secret: string, jwtToken: string): Observable<string>

    getPreSignPlayer(vid: string): Observable<BytearkPlayerType>
}
