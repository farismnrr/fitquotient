export interface IUserCvUsecaseContext {
  userCvCreateUsecase?: (
    userId: string,
    uploadData: { buffer: Buffer; filename: string; mimetype: string },
  ) => Promise<{ id: string; url: string }>;
  userCvGetByIdUsecase?: (cvId: string) => Promise<any>; // Adjust DTO as needed
  userCvSoftDeleteUsecase?: (cvId: string) => Promise<void>;
}
