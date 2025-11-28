import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Optional,
  Logger,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { jwtUtility, JwtPayload } from '../utilities/jwt.utility';
import { UserGetByIdUsecase } from '@users/usecases';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);
  constructor(
    @Optional() private readonly userGetByIdUsecase?: UserGetByIdUsecase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    const requestedUserId = (request.params as Record<string, unknown>)?.[
      'userId'
    ] as string | undefined;

    // No requested user ID -> nothing to validate
    if (!requestedUserId) return true;

    // If the usecase is not available in this module, log and skip validation
    if (!this.userGetByIdUsecase) {
      this.logger.warn(
        'UserGetByIdUsecase not available in this module context; skipping user ID validation',
      );
      return true;
    }

    const user =
      await this.userGetByIdUsecase.userGetByIdUsecase(requestedUserId);

    const tokenUserId = String(payload.sub);
    const actualUserId = String(user.id);

    if (tokenUserId !== actualUserId) {
      this.logger.warn(
        `Token user (${tokenUserId}) does not match requested user (${actualUserId})`,
      );
      throw new ForbiddenException('Forbidden');
    }
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
