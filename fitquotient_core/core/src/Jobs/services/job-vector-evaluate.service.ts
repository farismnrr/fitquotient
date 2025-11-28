import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EvaluateJobVectorException } from './service.error';
import { JobVectorEvaluateApiResponseDto } from '@jobs/dtos/jobs';

@Injectable()
export class JobVectorEvaluateService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.CV_ASSESSOR_BASE_URL || 'http://localhost:8080';
    this.apiKey = process.env.CV_ASSESSOR_API_KEY || '';
  }

  async evaluateJobVector(body: {
    cvId: string;
    jobId: string;
    comparisonId?: string;
    apiKey?: string;
    model?: string;
    provider?: string;
  }): Promise<JobVectorEvaluateApiResponseDto> {
    const endpoint = `${this.baseUrl.replace(/\/$/, '')}/api/jobs/evaluate`;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['X-API-Key'] = this.apiKey;
      }

      const response = await axios.post(endpoint, body, {
        headers,
        timeout: 10_000,
      });

      return response.data as JobVectorEvaluateApiResponseDto;
    } catch {
      throw new EvaluateJobVectorException();
    }
  }
}
