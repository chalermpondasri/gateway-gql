import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/modules/app.module'
import cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-ts'
async function bootstrap() {

    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: (requestOrigin, callback) => {
            callback(null, requestOrigin)
        },
        credentials: true,
    })
    app.use(cookieParser())
    app.use(graphqlUploadExpress());

    await app.listen(process.env.PORT || 3000)
}

bootstrap()
