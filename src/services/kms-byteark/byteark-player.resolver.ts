import {
    Args,
    Query,
    Resolver,
} from '@nestjs/graphql'
import { BytearkPlayerType } from '@/types/objects/byteark-player.type'
import {
    Inject,
    UseGuards,
} from '@nestjs/common'
import { ProviderName } from '@/constants/provider-name.const'
import { IKMSByteArkService } from '@/services/kms-byteark/interface/service.interface'
import { JwtGuard } from '@/utilities/guards/jwt.guard'

@Resolver(() => BytearkPlayerType)
@UseGuards(JwtGuard)
export class BytearkPlayerResolver {
    public constructor(
        @Inject(ProviderName.KMS_BYTE_ARK_PROVIDER)
        private readonly _byteArkService: IKMSByteArkService
    ) {
    }

    @Query(() => BytearkPlayerType)
    public getPreSignPlayer(
        @Args('vid') vid: string,
    ) {
        return this._byteArkService.getPreSignPlayer(vid)
    }
}