import {
  Controller,
  Put,
  Param,
  Body,
  UseFilters,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { GlobalExceptionFilter } from '@common/filters';
import { JwtGuard } from '@common/guards';
import { UpdateJobComparisonUsecase } from '@jobs/usecases/jobComparisons/update-job-comparison.usecase';
import { JobComparisonEntity } from '@jobs/entities';
import { UpdateJobComparisonDto } from '@jobs/dtos/jobComparisons/job-comparison.dto';
import { BaseResponseDto } from '@common/dtos';

@Controller('jobs/comparisons')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobComparisonUpdateController {
  constructor(private readonly updateUsecase: UpdateJobComparisonUsecase) {}

  @Put(':comparisonId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('comparisonId') comparisonId: string,
    @Body() body: UpdateJobComparisonDto,
  ): Promise<BaseResponseDto<null>> {
    const payload = body as unknown as Partial<JobComparisonEntity>;
    await this.updateUsecase.execute(comparisonId, payload);
    return {
      is_success: true,
      message: 'Comparison updated',
      data: null,
    };
  }
}
