import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticalService } from './statistical.service';
import { StatisticalDto } from './dto/statistical.dto';
import { RoleScope } from 'src/commons/enums';
import { SetRoles } from 'src/nest/decorators/set-roles.decorator';
import { ApplyAuthGuard } from 'src/nest/guards/auth.guard';

@ApiTags("statistical")
@Controller('statistical')
export class StatisticalController {
    constructor(
        private readonly staticalService: StatisticalService
    ) { }
    @ApiResponse({
        description: 'Get static success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get statistical' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async getStatistical(
        @Query() query: StatisticalDto,
    ) {
        return await this.staticalService.getStatistical(query);
    }

    @ApiResponse({
        description: 'Get static success',
        status: HttpStatus.OK,
    })
    @ApiOperation({ summary: 'Get statistical full month' })
    @ApplyAuthGuard()
    @SetRoles(RoleScope.ADMIN)
    @Get('/month')
    @HttpCode(HttpStatus.OK)
    async getStatisticalFullMonth(
    ) {
        return await this.staticalService.getStatisticalFullMonth();
    }
}
