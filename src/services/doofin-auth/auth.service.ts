import {
    Inject,
    Injectable,
    LoggerService
} from '@nestjs/common'
import {
    CreateUserRequest,
    IAuthRepository
} from '@/repositories/auth'
import { ProviderName } from '@/constants/provider-name.const'
import {
    from,
    map,
    Observable,
} from 'rxjs'
import {
    CreateUserInputType,
    CreateUserResponseType
} from '@/object-types'

@Injectable()
export class AuthService {
    private readonly _logger: LoggerService
    constructor(
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
    ) {
    }

    public createNewUser(request: CreateUserInputType): Observable<CreateUserResponseType> {
        const payload: CreateUserRequest = new CreateUserRequest()
        payload.email = request.email
        payload.dob = request.dob
        payload.password = request.password
        payload.acceptTermId = request.acceptTermId
        return from(this._authRepository.createNewUser(payload)).pipe(
            map(result => {
                const response = new CreateUserResponseType()
                response.userId = result.userId
                response.email = result.email
                response.otpToken = result.otpToken
                response.status = result.status
                return response
            })
        )
    }


}