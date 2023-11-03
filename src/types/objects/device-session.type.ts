import {
    Field,
    GraphQLISODateTime,
    ObjectType,
} from '@nestjs/graphql'
import { IdStringType } from '@/types/objects'

@ObjectType()
export class DeviceSessionType extends IdStringType {
    @Field()
    public deviceName: string
    @Field()
    public deviceId: string
    @Field()
    public isCurrentDevice: boolean
    @Field(() => GraphQLISODateTime)
    public lastAccess: Date
    @Field()
    public deviceType: string
}