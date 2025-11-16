export const ServiceErrorMessages = {
  CV_VECTOR: {
    CREATE_FAILED: 'Failed to create CV vector',
  },
};

export class CreateCvVectorException extends Error {
  constructor() {
    const message = ServiceErrorMessages.CV_VECTOR.CREATE_FAILED;
    super(message);
    this.name = 'CreateCvVectorException';
  }
}
