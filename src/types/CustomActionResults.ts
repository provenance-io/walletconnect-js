import { BaseResults } from './BaseResults';

export type CustomActionResults = BaseResults & {
  b64MessageArray?: string[],
}