import { Transform } from 'class-transformer'

export class DeviceSessionResponse {
    public id: string
    public deviceName: string
    @Transform(v => v.value ? new Date(v.value) : null)
    public lastAccess: Date
}