import { ResponseError } from '../../BrowserWallet';
import { PartialState, WCSState } from '../Service';

// TODO: This might be the results for every method, or at least should be...
export interface ResumeMethodServiceFunctionResults {
  state?: PartialState<WCSState>;
  error?: ResponseError;
  resetState?: boolean;
}
