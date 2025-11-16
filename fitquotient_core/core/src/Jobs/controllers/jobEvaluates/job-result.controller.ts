import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobResultUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobComparisonResultDto } from '@jobs/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobResultController {
  constructor(private readonly jobResultUsecase: JobResultUsecase) {}

  @Get('result/:cvId-:jobId')
  @HttpCode(HttpStatus.OK)
  async getResult(
    @Param('cvId') cvId: string,
    @Param('jobId') jobId: string,
  ): Promise<BaseResponseDto<JobComparisonResultDto>> {
    const result = await this.jobResultUsecase.execute({
      cvId,
      jobId,
    });

    return {
      isSuccess: true,
      message: 'Comparison result retrieved successfully',
      data: result,
    };
  }
}
