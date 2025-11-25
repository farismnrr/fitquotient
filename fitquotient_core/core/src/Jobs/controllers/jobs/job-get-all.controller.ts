import {
  Controller,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '@common/guards';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JobGetAllUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobGetDto } from '@jobs/dtos';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobGetAllController {
  constructor(private readonly jobGetAllUsecase: JobGetAllUsecase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<BaseResponseDto<{ jobs: JobGetDto[] }>> {
    const jobs = await this.jobGetAllUsecase.execute();

    return {
      is_success: true,
      message: 'Jobs retrieved successfully',
      data: { jobs },
    };
  }
}
