import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { JobCreateUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobCreateDto } from '@jobs/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobCreateController {
  constructor(private readonly jobCreateUsecase: JobCreateUsecase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async create(
    @Body() dto: JobCreateDto,
  ): Promise<BaseResponseDto<{ job_id: string }>> {
    const jobId = await this.jobCreateUsecase.jobCreateUsecase(dto);

    return {
      success: true,
      message: 'Job created successfully',
      data: { job_id: jobId },
    };
  }
}
