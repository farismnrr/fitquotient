import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { log } from '@common/utilities';
import { CreateCvVectorException } from './service.error';
import { CvVectorApiResponseDto } from '@users/dtos/userCVs';

/**
 * Service to forward CVs to the external vector API.
 * - Base URL is read from process.env.VECTOR_BASE_URL (fallback: http://localhost:8080)
 * - API key is read from process.env.VECTOR_API_KEY (optional)
 */
@Injectable()
export class CvVectorCreateService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.VECTOR_BASE_URL || 'http://localhost:8080';
    this.apiKey = process.env.VECTOR_API_KEY || '';
  }

  /**
   * Send a CV payload to the external vector service.
   * Returns the external API response body on success.
   */
  async createCvVector(body: {
    cvId: string;
    userId: string;
    filename: string;
    sourceUrl: string;
    text: string;
  }): Promise<CvVectorApiResponseDto> {
    const endpoint = `${this.baseUrl.replace(/\/$/, '')}/api/cvs`;

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

      return response.data as CvVectorApiResponseDto;
    } catch (err: unknown) {
      throw new CreateCvVectorException();
    }
  }
}
