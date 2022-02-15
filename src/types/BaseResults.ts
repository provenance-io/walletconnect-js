export type BaseResults = {
  method: string,
  valid: boolean,
  result?: Record<string, unknown>,
  error?: string | Error | unknown
};
