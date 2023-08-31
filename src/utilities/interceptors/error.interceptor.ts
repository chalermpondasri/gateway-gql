import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common'
import {
    catchError,
    Observable,
    throwError,
} from 'rxjs'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    constructor(

    ) {
    }
    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            catchError( err => {
                Logger.error(err)
                return throwError(() => err)
            })
        )
    }

}