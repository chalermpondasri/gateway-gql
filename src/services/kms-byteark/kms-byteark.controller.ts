import {
    Controller,
    Get,
    Headers,
    Inject,
    Post,
    Query,
    Res,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { IKMSByteArkService } from '@/services/kms-byteark/interface/service.interface'
import {
    map,
    tap,
} from 'rxjs'

@Controller('kms/byte_ark')
export class KmsByteArkController {

    public constructor(
        @Inject(ProviderName.KMS_BYTE_ARK_PROVIDER)
        private readonly _kmsByteArkService: IKMSByteArkService
    ) {
    }

    @Post('/key_encode')
    public getKeyForEncoder(
        @Query('token') token: string,
        @Headers('X-ByteArk-Qoder-Secret') secret: string,
        @Res() res,
    ) {
        return this._kmsByteArkService.getKeyEncode(secret, token).pipe(
            tap(stringKey => {
                const b = Buffer.alloc(16)
                b.write(stringKey, 'utf8')
                res.setHeader('Content-Type', 'application/octet-stream')
                res.setHeader('Cache-Control', 'private, no-cache, no-store')
                res.status(200).send(b)
            })
        )
    }

    @Get('/key_player')
    public getKeyForPlayer(
        @Query('token') token: string,
        @Headers('X-ByteArk-Qoder-Secret') secret: string,
    ) {
        return this._kmsByteArkService.getKeyPlayer(secret, token).pipe(
            map(stringKey => {
                return stringKey
            })
        )
    }
}