import { BaseResults } from './BaseResults';

export type CustomActionResults = BaseResults & {
  b64Message?: string,
}