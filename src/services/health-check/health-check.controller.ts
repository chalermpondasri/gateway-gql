import {
    Controller,
    Get,
    HttpCode,
} from '@nestjs/common'

@Controller('health-check')
export class HealthCheckController {

    @HttpCode(200)
    @Get('/')
    public healthCheck () {
        return 'PASS'
    }
}