export const RepositoryErrorMessages = {
  LLM_API_KEY: {
    CREATE_FAILED: 'Failed to create LLM API key',
    DELETE_FAILED: 'Failed to delete LLM API key',
    UPDATE_FAILED: 'Failed to update LLM API key',
  },
};

export class CreateLlmApiKeyException extends Error {
  constructor() {
    super(RepositoryErrorMessages.LLM_API_KEY.CREATE_FAILED);
    this.name = 'CreateLlmApiKeyException';
  }
}

export class DeleteLlmApiKeyException extends Error {
  constructor() {
    super(RepositoryErrorMessages.LLM_API_KEY.DELETE_FAILED);
    this.name = 'DeleteLlmApiKeyException';
  }
}

export class UpdateLlmApiKeyException extends Error {
  constructor() {
    super(RepositoryErrorMessages.LLM_API_KEY.UPDATE_FAILED);
    this.name = 'UpdateLlmApiKeyException';
  }
}
