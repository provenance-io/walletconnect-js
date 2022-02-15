import { BaseResults } from './BaseResults';

export type SignJWTResult = BaseResults & {
  signedJWT?: string,
  address?: string,
}