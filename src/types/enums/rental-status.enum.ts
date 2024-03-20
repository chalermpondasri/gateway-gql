import { registerEnumType } from '@nestjs/graphql'

export enum RentalStatus {
    FREE_TRIAL = 'free-trial',
    FREE_TO_WATCH = 'free-to-watch',
    SUBSCRIPTION_NEEDED = 'subscription-needed',
    SUBSCRIBED = 'subscribed',
}



registerEnumType(RentalStatus, {
    name: 'RentalStatus',
    description: 'media episode rental status'
})