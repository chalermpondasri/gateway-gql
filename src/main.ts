import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/modules/app.module'
import cookieParser from 'cookie-parser'
import { Logger } from '@nestjs/common'
async function bootstrap() {

    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: (requestOrigin, callback) => {
            Logger.log(requestOrigin, 'CORS')
            callback(null, requestOrigin)
        },
        credentials: true,
    })
    app.use(cookieParser())
    await app.listen(process.env.PORT || 3000)
}

bootstrap()
