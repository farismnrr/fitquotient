export const RepositoryErrorMessages = {
  JOB: {
    CREATE_FAILED: 'Failed to create job',
    UPDATE_FAILED: 'Failed to update job',
    DELETE_FAILED: 'Failed to delete job',
  },
};

export class CreateJobException extends Error {
  constructor() {
    const message = RepositoryErrorMessages.JOB.CREATE_FAILED;
    super(message);
    this.name = 'CreateJobException';
  }
}

export class UpdateJobException extends Error {
  constructor() {
    const message = RepositoryErrorMessages.JOB.UPDATE_FAILED;
    super(message);
    this.name = 'UpdateJobException';
  }
}

export class DeleteJobException extends Error {
  constructor() {
    const message = RepositoryErrorMessages.JOB.DELETE_FAILED;
    super(message);
    this.name = 'DeleteJobException';
  }
}
