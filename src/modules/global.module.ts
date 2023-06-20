import {
    Global,
    Module
} from '@nestjs/common'
import { envConfigProvider } from '@/providers/env.provider'

@Global()
@Module({
    providers: [
        envConfigProvider,
    ],
    exports: [
        envConfigProvider,
    ]
})
export class GlobalModule {
}