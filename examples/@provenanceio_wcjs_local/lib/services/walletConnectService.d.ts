import type { BroadcastResults, CustomActionData, DelegateHashData, MarkerAddData, MarkerData, SendCoinData, WCSSetFullState, WCSSetState, WCSState } from '../types';
export declare class WalletConnectService {
    #private;
    state: WCSState;
    addListener(eventName: string, callback: (results: BroadcastResults) => void): void;
    on(eventName: string, callback: () => void): void;
    removeListener(eventName: string, callback: (results: BroadcastResults) => void): void;
    removeAllListeners(): void;
    updateState(): void;
    setStateUpdater(setWalletConnectState: WCSSetFullState): void;
    resetState: () => void;
    setState: WCSSetState;
    showQRCode: (value: boolean) => void;
    markerActivate: (data: MarkerData) => Promise<void>;
    markerFinalize: (data: MarkerData) => Promise<void>;
    markerAdd: (data: MarkerAddData) => Promise<void>;
    cancelRequest: (denom: string) => Promise<void>;
    connect: (customBridge?: string) => Promise<void>;
    customAction: (data: CustomActionData) => Promise<void>;
    delegateHash: (data: DelegateHashData) => Promise<void>;
    disconnect: () => Promise<void>;
    sendCoin: (data: SendCoinData) => Promise<void>;
    signJWT: (expires: number) => Promise<void>;
    signMessage: (customMessage: string) => Promise<void>;
}
