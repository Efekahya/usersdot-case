type SuccesfulFetchResult<T> = {
  data: T;
  error: null;
  success: true;
};

type FailedFetchResult = {
  data: undefined;
  error: Error;
  success: false;
};

export type FetchResult<T> = SuccesfulFetchResult<T> | FailedFetchResult;
