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
    from, 
    map, 
    mergeMap, 
    throwError, 
} from 'rxjs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { 
    BadRequestException, 
    Logger, 
} from '@nestjs/common';

export class ByteArkRepository implements IByteArkRepository {
    private readonly _logger = new Logger(ByteArkRepository.name);
    public constructor(
        private readonly _s3: S3, 
        private readonly _config: EnvironmentConfig,
    ) {}

    private _generateSignedUrlForPut(params: PutObjectCommandInput) {
        return from(getSignedUrl(this._s3, new PutObjectCommand(params), { expiresIn: 60 }));
    }

    public generateSignedUrlForGet(params: GetObjectCommandInput): Observable<string> {
        return from(getSignedUrl(this._s3, new GetObjectCommand(params), { expiresIn: 120 }));
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
}
