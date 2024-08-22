import {
    Inject,
    Injectable,
} from '@nestjs/common'
import {
    ContactSupportRequest,
    CreateUserRequest,
    IAuthRepository,
    NotificationQueryRequest,
    UpdateUserDeviceSettingRequest,
} from '@/repositories/auth'
import { ProviderName } from '@/constants/provider-name.const'
import {
    concatMap,
    from,
    map,
    mergeMap,
    Observable,
    tap,
    toArray,
} from 'rxjs'
import {
    CategoryType,
    CreateUserResponseType,
    DeviceSessionType,
    JwtTokenType,
    MyListType,
    NotificationListType,
    NotificationType,
    ProfileRequestResetPinType,
    ProfileType,
    RequestOtpType,
    TicketType,
    UserAvailabilityCheckType,
    UserRequestEmailType,
    UserRequestOtpType,
    UserType,
    UserVerifyOtpType,
    UserWhoForgotPasswordType,
    ValidateProfilePinType,
    VerifyOtpToResetPasswordType,
    VerifyOtpType,
} from '@/types/objects'
import {
    ContactSupportInput,
    CreateProfileInput,
    CreateProfilePinInput,
    CreateUserInput,
    RequestOtpInput,
    UpdateContinueWatchingInput,
    UpdateProfileInput,
    UpdateProfilePinInput,
    UserChangePasswordInput,
    UserSettingInput,
    UserVerifyOtpInput,
    VerifyEmailInput,
    VerifyOtpInput,
    VerifyResetProfilePin,
} from '@/types/inputs'
import {
    instanceToPlain,
    plainToInstance,
} from 'class-transformer'

import { IByteArkRepository } from '@/repositories/byte-ark/repository.interface'
import { RequestContext } from '@/providers/request-context.provider'
import { IPlaybackRepository } from '@/repositories/playback/repository.interface'
import { UpdatePlaybackStatusRequest } from '@/repositories/playback/update-playback-status.request'
import {
    isEmpty,
    orderBy,
} from 'lodash'
import { ICacheService } from '@/services/cache/interface/service.interface'

@Injectable()
export class AuthService {

    public constructor(
        @Inject(ProviderName.AUTH_REPOSITORY)
        private readonly _authRepository: IAuthRepository,
        @Inject(ProviderName.BYTE_ARK_REPOSITORY)
        private readonly _byteArkRepository: IByteArkRepository,
        @Inject(ProviderName.REQUEST_CONTEXT)
        private readonly _reqCtx: RequestContext,
        @Inject(ProviderName.PLAYBACK_REPOSITORY)
        private readonly _playbackRepository: IPlaybackRepository,
        @Inject(ProviderName.CACHE_SERVICE)
        private readonly _cacheService: ICacheService,
    ) {
    }

    public createNewUser(request: CreateUserInput): Observable<CreateUserResponseType> {
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
            }),
        )
    }

    public sendOtp(request: RequestOtpInput): Observable<RequestOtpType> {
        return this._authRepository.requestOtp(request).pipe(
            map(data => {
                const typedResponse = new RequestOtpType()
                typedResponse.expiredAt = data.expiredAt
                typedResponse.referenceNumber = data.referenceNumber
                typedResponse.remaining = data.remaining
                return typedResponse
            }),
        )
    }

    public verifyOtp(request: VerifyOtpInput): Observable<VerifyOtpType> {
        return this._authRepository.verifyOtp(request).pipe(
            map(data => {
                const typedResponse = new VerifyOtpType()
                typedResponse.status = data.status
                typedResponse.userId = data.userId
                typedResponse.tokens = data.tokens
                return typedResponse
            }),
        )
    }

    public updateUserPreferences(profileId: string, preferences: string[]): Observable<CategoryType[]> {
        return this._authRepository.updateProfilePreferences(this._getCurrentProfileId(profileId), preferences).pipe(
            mergeMap(result => this.mapCategoryIdWithLabel(result.categories)),
        )
    }

    public getAllCategories(): Observable<CategoryType[]> {
        return this._authRepository.getCategories().pipe(
            map(response => {
                return plainToInstance(Array<CategoryType>, instanceToPlain(response.data))
            }),
        )
    }

    public doLogin(identity: string, password: string): Observable<JwtTokenType> {
        return this._authRepository.login(identity, password).pipe(
            map(response => {
                return plainToInstance(JwtTokenType, response)
            }),
        )
    }

    public verifyEmail(request: VerifyEmailInput): Observable<UserType> {
        return this._authRepository.verifyEmail(request).pipe(
            map(response => {
                return plainToInstance(UserType, response)
            }),
        )

    }

    private _extractJwt(token = '') {
        return token.substring(token.indexOf(' ') + 1)
    }

    public getProfiles(token: string): Observable<ProfileType[]> {
        return this._authRepository.getProfiles(this._extractJwt(token)).pipe(
            map((profile) => {
                return plainToInstance(Array<ProfileType>, instanceToPlain(profile.data))
            }),
        )
    }

    public createProfilePin(token: string, arg: CreateProfilePinInput): Observable<ProfileType> {
        return this._authRepository.createProfilePin(this._extractJwt(token), arg).pipe(
            map(res => {
                return plainToInstance(ProfileType, res)
            }),
        )
    }

    public changeProfilePin(token: string, arg: UpdateProfilePinInput): Observable<ProfileType> {
        return this._authRepository.changeProfilePin(this._extractJwt(token), arg).pipe(
            map(res => {
                return plainToInstance(ProfileType, res)
            }),
        )
    }

    public doRefreshToken(refreshToken: string): Observable<JwtTokenType> {
        return this._authRepository.refreshToken(this._extractJwt(refreshToken)).pipe(
            map(value => {
                return plainToInstance(JwtTokenType, value)
            }),
        )
    }

    public requestToChangePhoneNumber(token: string, phoneNumber: string): Observable<UserRequestOtpType> {
        return this._authRepository
            .requestToChangePhoneNumber(this._extractJwt(token), phoneNumber)
            .pipe(map((res) => plainToInstance(UserRequestOtpType, res)))
    }

    public verifyToChangePhoneNumber(token: string, input: UserVerifyOtpInput): Observable<UserVerifyOtpType> {
        return this._authRepository
            .verifyToChangePhoneNumber(this._extractJwt(token), input)
            .pipe(map((res) => plainToInstance(UserVerifyOtpType, res)))
    }

    public changePassword(token: string, input: UserChangePasswordInput): Observable<UserVerifyOtpType> {
        return this._authRepository
            .changePassword(this._extractJwt(token), input)
            .pipe(map((res) => plainToInstance(UserVerifyOtpType, res)))
    }

    public getProfileInformation(profileId: string): Observable<ProfileType> {
        return this._authRepository
            .getProfileById(profileId)
            .pipe(
                map(data => plainToInstance(ProfileType, data)),
            )
    }

    public getUser(token: string): Observable<UserType> {
        return this._authRepository.getCurrentUser(this._extractJwt(token)).pipe(
            map(data => plainToInstance(UserType, data)),
        )
    }

    public revokeSessions(): Observable<string[]> {
        return this._authRepository.flushSessions().pipe(
            map(data => data.ids),
        )
    }

    public revokeSession(session: string): Observable<DeviceSessionType> {
        return this._authRepository.revokeSingleSession(session).pipe(
            map(data => plainToInstance(DeviceSessionType, data)),
        )
    }

    public getContentRating(): Observable<string[]> {
        return this._authRepository.getContentRating()
    }

    public getUserSessions(deviceId = ''): Observable<DeviceSessionType[]> {
        return this._authRepository.listUserSessions().pipe(
            concatMap(data => from(data)),
            map(session => {
                if (isEmpty(deviceId)) {
                    Object.assign(session, {
                        isCurrentDevice: false,
                    })
                } else {
                    Object.assign(session, {
                        isCurrentDevice: deviceId === session.deviceId,
                    })
                }
                return plainToInstance(DeviceSessionType, session)
            }),
            toArray(),
            map(result => {
                if (isEmpty(deviceId)) {
                    return result
                }
                return orderBy(result, ['isCurrentDevice', 'lastAccess'], ['desc', 'desc'])
            }),
        )

    }

    public requestToChangeEmail(token: string, newEmail: string): Observable<UserRequestEmailType> {
        return this._authRepository.requestToChangeEmail(this._extractJwt(token), newEmail)
    }

    public verifyToChangeEmail(token: string, input: UserVerifyOtpInput): Observable<UserVerifyOtpType> {
        return this._authRepository
            .verifyToChangeEmail(this._extractJwt(token), input)
            .pipe(map((res) => plainToInstance(UserVerifyOtpType, res)))
    }

    public validateProfilePin(profileId: string, pin: string): Observable<ValidateProfilePinType> {
        return this._authRepository.validateProfilePin(this._getCurrentProfileId(profileId), pin).pipe(
            map(data => plainToInstance(ValidateProfilePinType, data)),
        )
    }

    public createProfile(body: CreateProfileInput): Observable<ProfileType> {
        return this._authRepository.createProfile(body).pipe(
            map(data => plainToInstance(ProfileType, data)),
        )
    }

    public requestTokenToResetPin(profileId: string, password: string): Observable<ProfileRequestResetPinType> {
        return this._authRepository.requestTokenToResetPin(profileId, password).pipe(
            map(data => plainToInstance(ProfileRequestResetPinType, data)),
        )
    }

    public verifyTokenToResetPin(input: VerifyResetProfilePin): Observable<ProfileType> {
        return this._authRepository.verifyTokenToResetPin(input).pipe(
            map(data => plainToInstance(ProfileType, data)),
        )
    }

    public updateUserSetting(input: UserSettingInput): Observable<UserType> {
        const payload = new UpdateUserDeviceSettingRequest()
        payload.deviceLocale = input.lzDeviceLocale
        payload.notificationAllowNewRelease = input.notificationNewRelease
        payload.notificationAllowNewsAndPromotions = input.notificationNewsAndPromotions
        payload.notificationAllowPush = input.notificationAllowPush
        payload.pbAutoAdjustQuality = input.pbAutoAdjustQuality
        payload.pbAutoPlayNext = input.pbAutoplayNext
        payload.pbAutoPlayTrailer = input.pbAutoPlayTrailer
        payload.pbNetworkThrottlingMode = input.pbNetworkThrottlingMode
        payload.pbWarnOnCellular = input.pbWarnOnCellular
        payload.pbWifiOnly = input.pbWifiOnly
        payload.videoSubtitle = input.videoSubtitle

        return this._authRepository.updateUserSetting(payload).pipe(
            map(data => plainToInstance(UserType, data)),
        )
    }

    public getNotification(notiQuery: NotificationQueryRequest): Observable<NotificationListType> {
        return this._authRepository.getNotification(plainToInstance(NotificationQueryRequest, notiQuery)).pipe(
            map(res => plainToInstance(NotificationListType, res)),
        )
    }

    public markAllNotiAsRead(profileId: string): Observable<{ status: boolean }> {
        return this._authRepository.readAllNotification(profileId)
    }

    public markNotiAsRead(notificationId: string): Observable<NotificationType> {
        return this._authRepository.readNotificationById(notificationId).pipe(
            map(res => plainToInstance(NotificationType, res)),
        )
    }

    public getMyList(profileId?: string): Observable<MyListType[]> {
        return this._authRepository.getMyList(this._getCurrentProfileId(profileId)).pipe(
            concatMap(res => from(res)),
            map(res => plainToInstance(MyListType, res)),
            toArray(),
        )
    }

    public addToMyList(profileId: string, programId: string): Observable<MyListType[]> {
        return this._authRepository.addToMyList(this._getCurrentProfileId(profileId), programId).pipe(
            concatMap(res => from(res)),
            map(res => plainToInstance(MyListType, res)),
            toArray(),
        )
    }

    public removeFromMyList(profileId: string, programId: string): Observable<MyListType[]> {
        return this._authRepository.removeFromMyList(this._getCurrentProfileId(profileId), programId).pipe(
            concatMap(res => from(res)),
            map(res => plainToInstance(MyListType, res)),
            toArray(),
        )
    }

    public updateProfile(profileId: string, input: UpdateProfileInput): Observable<ProfileType> {
        return this._authRepository.updateProfile(this._getCurrentProfileId(profileId), input).pipe(
            map(res => plainToInstance(ProfileType, res)),
            tap(() => this._cacheService.deleteCache(`gql_profile_${profileId}`))
        )
    }

    public requestTokenToResetPinByAdmin(profileId: string, adminPin: string): Observable<ProfileRequestResetPinType> {
        return this._authRepository.requestTokenToResetPinByAdmin(profileId, adminPin).pipe(
            map(res => plainToInstance(ProfileRequestResetPinType, res)),
        )
    }

    public mapCategoryIdWithLabel(categoryIds: string[]): Observable<CategoryType[]> {
        return this.getAllCategories().pipe(
            concatMap(allCategories => {
                return from(categoryIds).pipe(
                    map(categoryId => {
                        const c = new CategoryType()
                        c.id = categoryId
                        c.label = allCategories.find(e => e.id === categoryId)?.label ?? ''
                        return c
                    }),
                    toArray(),
                )
            }),
        )
    }

    public sendTicketToSupport(input: ContactSupportInput): Observable<TicketType> {
        const requestBody = plainToInstance(ContactSupportRequest, input, { excludeExtraneousValues: true })
        if (input.images.length === 0) {
            return this._authRepository.sendTicketToSupport(requestBody).pipe(
                map((ticketId) => ({ status: true, ticketId })),
            )
        }
        return this._byteArkRepository.generateOriginalUrlToSignedUrl(input.images, 180).pipe(
            mergeMap(imgWithSign => {
                requestBody.signedImageUrls = imgWithSign
                return this._authRepository.sendTicketToSupport(requestBody).pipe(
                    map((ticketId) => ({ status: true, ticketId })),
                )
            }),
        )

    }

    public findUserWhoForgotPassword(emailOrPhone: string): Observable<UserWhoForgotPasswordType> {
        return this._authRepository.findUserWhoForgotPassword(emailOrPhone).pipe(
            map(res => {
                return plainToInstance(UserWhoForgotPasswordType, res)
            }),
        )
    }

    public requestOtpToResetPassword(userId: string, sendVia: string): Observable<UserRequestOtpType> {
        return this._authRepository.requestOtpToResetPassword(userId, sendVia).pipe(
            map(data => plainToInstance(UserRequestOtpType, data)),
        )
    }

    public verifyOtpToResetPassword(input: VerifyOtpInput): Observable<VerifyOtpToResetPasswordType> {
        return this._authRepository.verifyOtpToResetPassword(input)
    }

    public resetPassword(resetPasswordToken: string, newPassword: string): Observable<UserVerifyOtpType> {
        return this._authRepository.resetPassword(resetPasswordToken, newPassword)
    }

    public updateContinueWatching(input: UpdateContinueWatchingInput): Observable<string> {
        const profileId = this._getCurrentProfileId(input.profileId)
        const data: UpdatePlaybackStatusRequest = input
        return this._playbackRepository.updatePlaybackStatus(profileId, data)
    }

    public switchProfile(profileId: string): Observable<ProfileType> {
        return this.getProfileInformation(profileId)
    }

    public requestOtpTokenToConfirmPhoneNumber() {
        return this._authRepository.requestOtpTokenToConfirmPhoneNumber()
    }

    public getUserAvailability(): Observable<UserAvailabilityCheckType> {
        return this._authRepository.getUserAvailability().pipe(
            map(result => {
                return plainToInstance(UserAvailabilityCheckType, result)
            }),
        )
    }

    public resendVerificationEmail(): Observable<boolean> {
        return this._authRepository.resendVerificationEmail()
    }

    private _getCurrentProfileId(profileIdInput?: string): string {
        return !!profileIdInput ? profileIdInput : this._reqCtx.profileId
    }

}