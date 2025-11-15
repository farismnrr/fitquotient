import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { jwtUtility, JwtPayload } from '../utilities/jwt.utility';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user?: JwtPayload }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = jwtUtility.verify(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach payload to request object for use in controllers
    request.user = payload;
    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authHeader = (request.headers as Record<string, unknown>)[
      'authorization'
    ];

    if (!authHeader || typeof authHeader !== 'string') {
      return undefined;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return undefined;
    }

    return parts[1];
  }
}
