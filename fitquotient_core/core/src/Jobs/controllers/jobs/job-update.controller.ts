import {
  Controller,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { JobUpdateUsecase } from '@jobs/usecases';
import { BaseResponseDto } from '@common/dtos';
import { JobIdDto, JobUpdateDto } from '@jobs/dtos';
import { GlobalExceptionFilter } from '@common/filters';
import { CaseTransformerInterceptor } from '@common/interceptors';
import { JwtGuard } from '@common/guards';

@Controller('jobs')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(CaseTransformerInterceptor)
@UseGuards(JwtGuard)
export class JobUpdateController {
  constructor(private readonly jobUpdateUsecase: JobUpdateUsecase) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async update(
    @Param() params: JobIdDto,
    @Body() dto: JobUpdateDto,
  ): Promise<BaseResponseDto<null>> {
    await this.jobUpdateUsecase.jobUpdateUsecase(params.id, dto);

    return {
      is_success: true,
      message: 'Job updated successfully',
      data: null,
    };
  }
}
