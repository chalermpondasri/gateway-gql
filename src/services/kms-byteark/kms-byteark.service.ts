import {
    IByteArkTokenPayload,
    IKMSByteArkService,
} from '@/services/kms-byteark/interface/service.interface'
import {
    catchError,
    from,
    map,
    mergeMap,
    Observable,
    throwError,
} from 'rxjs'
import { EnvironmentConfig } from '@/models/common'
import {
    ForbiddenException,
    InternalServerErrorException,
    Logger,
    LoggerService,
} from '@nestjs/common'
import { verify } from 'jsonwebtoken'
import * as crypto from 'crypto'
import {
    decryptionData,
    encryptionData,
} from '@/utilities/encrypt-decrypt.util'
import { IAuthRepository } from '@/repositories/auth'
import {
    isEmpty,
    isNil,
} from 'lodash'

export class KmsByteArkService implements IKMSByteArkService {
    private readonly _logger: LoggerService

    public constructor(
        private readonly _config: EnvironmentConfig,
        private readonly _authRepo: IAuthRepository
    ) {
        this._logger = new Logger(KmsByteArkService.name)
    }
    
    private _validateSecretAndToken(secret: string, jwtToken: string, mode?: string): Promise<IByteArkTokenPayload> {
        if(isNil(mode)) {
            if (this._config.BYTE_ARK_VIDEO_SECRET_ENCODE !== secret) {
                this._logger.log(`[GetKey-Encode] secret not match income : ${secret}`)
                throw new ForbiddenException('Secret not match')
            }
        }
        return new Promise((resolve, reject) => {
            verify(jwtToken, this._config.BYTE_ARK_VIDEO_SECRET_JWT, {
                algorithms: ['HS256'],
                complete: true,
            }, (error, decoded) => {
                if (error) {
                    console.log(error)
                    reject('Verify not success')
                }
                resolve(decoded.payload as IByteArkTokenPayload)
            })
        })

    }

    public getKeyEncode(secret: string, jwtToken: string): Observable<string> {
        const validatePromise = this._validateSecretAndToken(secret, jwtToken)
        return from(validatePromise).pipe(
            mergeMap((payload: IByteArkTokenPayload) => {
                return this._authRepo.getKMSVideoKey(payload.content_id).pipe(
                    map(hashData => {
                        if(isNil(hashData)) {
                            this._logger.log(`[KEY-EN][${payload.content_id}] Hash DATA is null -> save new `)
                            const keyVideo = crypto.randomBytes(8).toString('hex')
                            const enData = encryptionData(this._config.SECRET_ENCRYPT_KEY_VIDEO, keyVideo)
                            this._authRepo.newKMSVideoKey(payload.content_id, enData).subscribe()
                            // const deData = decryptionData(this._config.SECRET_ENCRYPT_KEY_VIDEO, enData)
                            return keyVideo
                        } else {
                            this._logger.log(`[KEY-EN][${payload.content_id}] Hash DATA is not null `)
                            return decryptionData(this._config.SECRET_ENCRYPT_KEY_VIDEO, hashData)
                        }
                    })
                )
            }),
            catchError(err => {
                return throwError(() => new ForbiddenException(err))
                // return of('false')
            }),
        )

    }

    public getKeyPlayer(secret: string, jwtToken: string): Observable<string> {
        const validatePromise = this._validateSecretAndToken(secret, jwtToken, 'player')
        return from(validatePromise).pipe(
            mergeMap((payload: IByteArkTokenPayload) => {
                return this._authRepo.getKMSVideoKey(payload.content_id)
            }),
            map((hash: string) => {
                if (isNil(hash)) {
                    throw new InternalServerErrorException('Hash is null')
                }
                return decryptionData(this._config.SECRET_ENCRYPT_KEY_VIDEO, hash)
            }),
            catchError(err => {
                return ''
            })
        )
    }

}