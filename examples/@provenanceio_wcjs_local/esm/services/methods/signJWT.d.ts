import type { BaseResults, WCSState, WCSSetState } from '../../types';
export declare const signJWT: (state: WCSState, setState: WCSSetState, expires?: number) => Promise<BaseResults>;
