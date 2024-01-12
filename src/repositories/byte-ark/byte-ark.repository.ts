import {
    GetObjectCommand,
    GetObjectCommandInput,
    PutObjectCommand,
    PutObjectCommandInput,
    S3,
} from '@aws-sdk/client-s3';
import { IByteArkRepository } from './repository.interface';
import { EnvironmentConfig } from '@/models/common';
import { Observable, 
    catchError, 
    filter, 
    from, 
    map, 
    mergeMap, 
    of, 
    throwError,
    toArray, 
} from 'rxjs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { 
    BadRequestException, 
    Logger, 
} from '@nestjs/common';
import  mime from 'mime';
import { uniq } from 'lodash';

export class ByteArkRepository implements IByteArkRepository {
    private readonly _logger = new Logger(ByteArkRepository.name);
    public constructor(
        private readonly _s3: S3, 
        private readonly _config: EnvironmentConfig,
    ) {}

    private _generateSignedUrlForPut(params: PutObjectCommandInput) {
        return from(getSignedUrl(this._s3, new PutObjectCommand(params), { expiresIn: 60 }));
    }

    private _generateSignedUrlForGet(params: GetObjectCommandInput, expiresIn: number): Observable<string> {
        // expiresIn: seconds
        return from(getSignedUrl(this._s3, new GetObjectCommand(params), { expiresIn }));
    }

    public uploadFile(imgName: string, file: Buffer): Observable<string> {
        return this._generateSignedUrlForPut({
            Bucket: this._config.IMAGE_BUCKET_NAME,
            Key: imgName,
        }).pipe(
            mergeMap((url) => {
                return from(axios.put(url, file)).pipe(
                    catchError((e) => {
                        this._logger.error(e);
                        return throwError(() => new BadRequestException(e));
                    })
                );
            }),
            map(() => `${this._config.BYTE_ARK_END_POINT}/${this._config.IMAGE_BUCKET_NAME}/${imgName}`)
        );
    }

    public generateOriginalUrlToSignedUrl(urls: string[], expiresIn: number): Observable<string[]> {
        if(!urls || urls.length === 0) return of([])      
        return from(uniq(urls)).pipe(
            mergeMap((f) => {
                if (!f.startsWith(process.env.BYTE_ARK_END_POINT)) {
                    return of(null)
                }
                const imgName = f.split("/").pop();
                return this._generateSignedUrlForGet(
                    {
                        Bucket: process.env.IMAGE_BUCKET_NAME,
                        Key: imgName,
                        ResponseContentType: mime.getType(imgName),
                    },
                    expiresIn
                );
            }),
            filter(e=> !!e),
            toArray()
        );
    }
}
