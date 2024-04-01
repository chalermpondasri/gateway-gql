import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/modules/app.module'
import cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import {
    PipeTransform,
    ValidationPipe,
} from '@nestjs/common'
import * as process from 'process'
async function bootstrap() {

    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: process.env.NODE_ENV !== 'production' ? ["http://localhost", /\.doofin\.rest$/] : true,
        credentials: true,
    })
    const nestValidationPipes: PipeTransform[] = [
        new ValidationPipe({
            transform: true,
        }),
    ]
    app.useGlobalPipes(...nestValidationPipes)

    app.use(cookieParser())
    app.use(graphqlUploadExpress());

    await app.listen(process.env.PORT || 3000)
}

bootstrap()
