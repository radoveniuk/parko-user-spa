export type QueryOptions = {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  initialData?: any;
  onError?(err: unknown): void;
};
