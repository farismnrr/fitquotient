import {
  Controller,
  Get,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { GlobalExceptionFilter } from '@common/filters';
import { JwtGuard } from '@common/guards';
import { GetAllJobComparisonsUsecase } from '@jobs/usecases/jobComparisons/get-all-job-comparisons.usecase';
import { BaseResponseDto } from '@common/dtos';
import { JobComparisonResultDto } from '@jobs/dtos/jobEvaluates/job-result.dto';

@Controller('jobs/comparisons')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobComparisonGetAllController {
  constructor(private readonly getAllUsecase: GetAllJobComparisonsUsecase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<BaseResponseDto<JobComparisonResultDto[]>> {
    const data = await this.getAllUsecase.execute();

    return {
      is_success: true,
      message: 'Job comparisons retrieved',
      data,
    };
  }
}
