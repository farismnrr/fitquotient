export const RepositoryErrorMessages = {
  USER: {
    CREATE_FAILED: 'Failed to create user',
    UPDATE_FAILED: 'Failed to update user',
    DELETE_FAILED: 'Failed to delete user',
  },
};

export class CreateUserException extends Error {
  constructor() {
    const message = RepositoryErrorMessages.USER.CREATE_FAILED;
    super(message);
    this.name = 'CreateUserException';
  }
}

export class UpdateUserException extends Error {
  constructor() {
    const message = RepositoryErrorMessages.USER.UPDATE_FAILED;
    super(message);
    this.name = 'UpdateUserException';
  }
}

export class DeleteUserException extends Error {
  constructor() {
    const message = RepositoryErrorMessages.USER.DELETE_FAILED;
    super(message);
    this.name = 'DeleteUserException';
  }
}
