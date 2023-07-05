import {
    ArgumentsHost,
    Catch,
    HttpException
} from '@nestjs/common'
import {
    GqlArgumentsHost,
    GqlExceptionFilter
} from '@nestjs/graphql'

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host)
        return exception
    }
}