export const ServiceErrorMessages = {
  JOB_VECTOR: {
    CREATE_FAILED: 'Failed to create Job vector',
    EVALUATE_FAILED: 'Failed to evaluate Job vector',
    GET_RESULT_FAILED: 'Failed to get Job result',
  },
};

export class CreateJobVectorException extends Error {
  constructor() {
    const message = ServiceErrorMessages.JOB_VECTOR.CREATE_FAILED;
    super(message);
    this.name = 'CreateJobVectorException';
  }
}

export class EvaluateJobVectorException extends Error {
  constructor() {
    const message = ServiceErrorMessages.JOB_VECTOR.EVALUATE_FAILED;
    super(message);
    this.name = 'EvaluateJobVectorException';
  }
}

export class GetJobResultException extends Error {
  constructor() {
    const message = ServiceErrorMessages.JOB_VECTOR.GET_RESULT_FAILED;
    super(message);
    this.name = 'GetJobResultException';
  }
}
