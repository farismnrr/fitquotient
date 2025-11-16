import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateJobVectorException } from './service.error';
import { JobVectorApiResponseDto } from '@jobs/dtos/jobs';

@Injectable()
export class JobVectorCreateService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.VECTOR_BASE_URL || 'http://localhost:8080';
    this.apiKey = process.env.VECTOR_API_KEY || '';
  }

  async createJobVector(body: {
    jobId: string;
    text: string;
  }): Promise<JobVectorApiResponseDto> {
    const endpoint = `${this.baseUrl.replace(/\/$/, '')}/api/jobs`;

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

      return response.data as JobVectorApiResponseDto;
    } catch {
      throw new CreateJobVectorException();
    }
  }
}
