import type { FastifyRequest } from 'fastify';

export interface IUserCvUsecaseContext {
  userCvCreateUsecase?: (
    userId: string,
    req: FastifyRequest,
  ) => Promise<{ id: string; url: string }>;
  userCvGetByIdUsecase?: (cvId: string) => Promise<any>; // Adjust DTO as needed
  userCvSoftDeleteUsecase?: (cvId: string) => Promise<void>;
}
