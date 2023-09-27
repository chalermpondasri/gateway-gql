
import {
    Inject,
    Injectable,
    Logger,
    NestMiddleware,
    Provider,
    Scope,
} from '@nestjs/common'
import {
    Language,
    parse,
} from 'accept-language-parser'
import {
    NextFunction,
    Request,
    Response,
} from 'express'
import {
    EMPTY,
    mergeMap,
    of,
    tap,
} from 'rxjs'
import { v4 } from 'uuid'
import { ProviderName } from '@/constants/provider-name.const'
import { extractTokenFromHeader } from '@/utilities/token.util'
export class RequestContext {
    public readonly ts = Date.now()
    public request: Request
    public languages: Language[] = []
    public cookies: Record<string, any>
    public headers: any
    public token: string

    public parseLanguageFromHeader(acceptLang: string): void {
        this.languages = parse(acceptLang)
    }
}

export const requestContextProvider: Provider = {
    provide: ProviderName.REQUEST_CONTEXT,
    scope: Scope.REQUEST,
    useClass: RequestContext,
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    public constructor(
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _rc: RequestContext,
    ) {}

    public use(req: Request, res: Response, next: NextFunction) {
        return of(req)
            .pipe(
                tap((r) => {
                    this._rc.headers = r.headers

                    if (!r.cookies['machineId']) {
                        res.cookie('machineId', v4())
                    }
                    this._rc.cookies = r.cookies
                    this._rc.request = r

                    this._rc.parseLanguageFromHeader(r.headers['accept-language'] ?? 'en')
                    if (!r.headers['authorization']) {
                        return EMPTY
                    }
                    this._rc.token = extractTokenFromHeader(r.headers['authorization'])
                }),
            )
            .subscribe({
                complete: () => next(),
                error: (e) => {
                    Logger.log(e, `RequestContext`)
                    next()
                },
            })
    }
}
