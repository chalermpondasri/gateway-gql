
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
    of,
    tap,
} from 'rxjs'
import { ProviderName } from '@/constants/provider-name.const'
import { extractTokenFromHeader } from '@/utilities/token.util'
import { pick } from 'lodash'
import { randomUUID } from 'crypto'
export class RequestContext {
    public readonly ts = Date.now()
    public request: Request
    public languages: Language[] = []
    public headers: any
    public token: string
    public deviceId: string
    public profileId: string

    public parseLanguageFromHeader(acceptLang: string): void {
        this.languages = parse(acceptLang)
    }

    public getHeaders(): Record<string,string> {
        return pick(this.headers, [
            'authorization',
            'accept-language',
            'user-agent',
        ])
    }
}

export const requestContextProvider: Provider = {
    provide: ProviderName.REQUEST_CONTEXT,
    scope: Scope.REQUEST,
    useClass: RequestContext,
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    private readonly _logger: Logger
    public constructor(
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _rc: RequestContext,
    ) {
        this._logger = new Logger(RequestContextMiddleware.name)
    }

    public use(req: Request, res: Response, next: NextFunction) {
        return of(req)
            .pipe(
                tap((r) => {
                    const did = req.cookies['did'] ?? randomUUID()
                    res.cookie('did', did)
                    this._rc.deviceId = did
                    this._rc.headers = r.headers

                    this._rc.request = r

                    this._rc.parseLanguageFromHeader(r.headers['accept-language'] ?? 'en')
                    if (!r.headers['authorization']) {
                        return EMPTY
                    }
                    this._rc.token = extractTokenFromHeader(r.headers['authorization'])
                    this._rc.profileId = req.cookies['profileId'] ?? null


                }),
            )
            .subscribe({
                complete: () => next(),
                error: (e) => {
                    this._logger.error(e)
                    next()
                },
            })
    }
}
