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
import { JobGetByIdUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobIdDto, JobGetDto } from '@jobs/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobGetByIdController {
  constructor(private readonly jobGetByIdUsecase: JobGetByIdUsecase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param() params: JobIdDto,
  ): Promise<BaseResponseDto<{ job: JobGetDto }>> {
    const job = await this.jobGetByIdUsecase.jobGetByIdUsecase(params.id);

    return {
      success: true,
      message: 'Job retrieved successfully',
      data: {
        job,
      },
    };
  }
}
