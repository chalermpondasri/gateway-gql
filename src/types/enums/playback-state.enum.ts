import { registerEnumType } from '@nestjs/graphql'

export enum PlaybackState {
    NEW_SESSION = 'NEW_SESSION',
    CONTINUE = 'CONTINUE',
}


registerEnumType(PlaybackState, {
    name: 'PlaybackState',
})