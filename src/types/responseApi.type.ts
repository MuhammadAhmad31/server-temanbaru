/*
  * API Response Interface
  * This interface defines the structure of a standard API response.
  * It includes fields for success status, data, message, error, count, timestamp, and requestId.
*/ 
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  timestamp?: string;
  requestId?: string;
}

/*
  * Pagination Metadata Interface
  * This interface defines the structure for pagination metadata in a paginated response.
  * It includes fields for current page, total pages, total items, items per page, and flags for next/previous pages.
*/
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}


export interface PaginatedApiResponse<T = any> extends Omit<ApiResponse<T>, 'data'> {
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
  value?: any;
}

export interface ErrorApiResponse extends Omit<ApiResponse, 'data'> {
  success: false;
  error: string;
  errorCode?: string;
  errorDetails?: ErrorDetail[];
  statusCode?: number;
}

export interface SuccessApiResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export type ApiResponseResult<T = any> = SuccessApiResponse<T> | ErrorApiResponse;


/**
 * API Response Builder Class
 * This class provides static methods to build various types of API responses,
 * including success responses, paginated responses, and error responses.
 */
export class ApiResponseBuilder {
  /**
   * Create a successful response
   */
  static success<T>(data: T, message?: string, count?: number): SuccessApiResponse<T> {
    return {
      success: true,
      data,
      message,
      count,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a successful response with pagination
   */
  static successWithPagination<T>(
    items: T[],
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    message?: string
  ): PaginatedApiResponse<T> {
    const pagination: PaginationMeta = {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : undefined,
      prevPage: currentPage > 1 ? currentPage - 1 : undefined,
    };

    return {
      success: true,
      data: {
        items,
        pagination,
      },
      message,
      count: items.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an error response
   */
  static error(
    error: string,
    statusCode?: number,
    errorCode?: string,
    errorDetails?: ErrorDetail[]
  ): ErrorApiResponse {
    return {
      success: false,
      error,
      errorCode,
      errorDetails,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a validation error response
   */
  static validationError(
    message: string = 'Validation failed',
    errors: ErrorDetail[]
  ): ErrorApiResponse {
    return {
      success: false,
      error: message,
      errorCode: 'VALIDATION_ERROR',
      errorDetails: errors,
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a not found error response
   */
  static notFound(resource: string = 'Resource'): ErrorApiResponse {
    return {
      success: false,
      error: `${resource} not found`,
      errorCode: 'NOT_FOUND',
      statusCode: 404,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an unauthorized error response
   */
  static unauthorized(message: string = 'Unauthorized access'): ErrorApiResponse {
    return {
      success: false,
      error: message,
      errorCode: 'UNAUTHORIZED',
      statusCode: 401,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a forbidden error response
   */
  static forbidden(message: string = 'Access forbidden'): ErrorApiResponse {
    return {
      success: false,
      error: message,
      errorCode: 'FORBIDDEN',
      statusCode: 403,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a conflict error response
   */
  static conflict(message: string = 'Resource already exists'): ErrorApiResponse {
    return {
      success: false,
      error: message,
      errorCode: 'CONFLICT',
      statusCode: 409,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an internal server error response
   */
  static internalError(message: string = 'Internal server error'): ErrorApiResponse {
    return {
      success: false,
      error: message,
      errorCode: 'INTERNAL_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    };
  }
}

export interface UserListResponse extends SuccessApiResponse<any[]> {
  data: any[];
}

export interface UserDetailResponse extends SuccessApiResponse<any> {
  data: any;
}

export interface UserPaginatedResponse extends PaginatedApiResponse<any> {
  data: {
    items: any[];
    pagination: PaginationMeta;
  };
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;


export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];