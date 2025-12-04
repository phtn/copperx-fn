export class CopperxError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'CopperxError';
    Object.setPrototypeOf(this, CopperxError.prototype);
  }
}

export class CopperxAPIError extends CopperxError {
  constructor(
    message: string,
    statusCode: number,
    code?: string,
    details?: unknown
  ) {
    super(message, statusCode, code, details);
    this.name = 'CopperxAPIError';
    Object.setPrototypeOf(this, CopperxAPIError.prototype);
  }
}

export class CopperxNetworkError extends CopperxError {
  constructor(message: string, originalError?: unknown) {
    super(message, undefined, 'NETWORK_ERROR', originalError);
    this.name = 'CopperxNetworkError';
    Object.setPrototypeOf(this, CopperxNetworkError.prototype);
  }
}

export class CopperxAuthenticationError extends CopperxError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'CopperxAuthenticationError';
    Object.setPrototypeOf(this, CopperxAuthenticationError.prototype);
  }
}

export class CopperxValidationError extends CopperxError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'CopperxValidationError';
    Object.setPrototypeOf(this, CopperxValidationError.prototype);
  }
}

