import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GetJobResultException } from './service.error';
import { JobComparisonResultDto } from '@jobs/dtos';

export interface JobResultApiResponseDto {
  isSuccess: boolean;
  message: string;
  data: JobComparisonResultDto;
}

@Injectable()
export class JobVectorResultService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.CV_ASSESSOR_BASE_URL || 'http://localhost:8080';
    this.apiKey = process.env.CV_ASSESSOR_API_KEY || '';
  }

  async getJobResult(
    cvId: string,
    jobId: string,
  ): Promise<JobResultApiResponseDto> {
    const endpoint = `${this.baseUrl.replace(/\/$/, '')}/api/jobs/result/${cvId}-${jobId}`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const response = await axios.get(endpoint, {
        headers,
        timeout: 10_000,
      });

      return response.data as JobResultApiResponseDto;
    } catch {
      throw new GetJobResultException();
    }
  }
}
