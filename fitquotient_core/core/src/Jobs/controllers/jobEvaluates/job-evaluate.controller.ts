import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobEvaluateUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobEvaluateDto, JobVectorEvaluateDataDto } from '@jobs/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobEvaluateController {
  constructor(private readonly jobEvaluateUsecase: JobEvaluateUsecase) {}

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluate(
    @Body()
    dto: JobEvaluateDto,
  ): Promise<BaseResponseDto<JobVectorEvaluateDataDto>> {
    const result = await this.jobEvaluateUsecase.execute(dto);

    return {
      isSuccess: true,
      message: 'Job evaluated successfully',
      data: result,
    };
  }
}
