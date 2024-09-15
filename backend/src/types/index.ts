type SuccessfulQueryResult<T> = {
  success: true;
  data: T;
  error?: undefined;
};

type FailedQueryResult = {
  success: false;
  error: string;
  data?: undefined;
};

export type QueryResult<T> = SuccessfulQueryResult<T> | FailedQueryResult;
