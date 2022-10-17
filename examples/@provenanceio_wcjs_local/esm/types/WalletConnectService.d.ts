import type WalletConnectClient from '@walletconnect/client';
import type { IClientMeta } from './IClientMeta';
import type { WalletId } from './WalletList';
import type { WalletInfo } from './ConnectData';
export declare type WalletConnectClientType = WalletConnectClient;
export interface WCSState {
    account: string;
    address: string;
    bridge: string;
    connected: boolean;
    connectionEat: number | null;
    connectionIat: number | null;
    connectionTimeout: number;
    connector: WalletConnectClientType | null;
    figureConnected: boolean;
    isMobile: boolean;
    loading: string;
    newAccount: boolean;
    peer: IClientMeta | null;
    publicKey: string;
    QRCode: string;
    QRCodeUrl: string;
    showQRCodeModal: boolean;
    signedJWT: string;
    walletApp?: WalletId | '';
    walletInfo: WalletInfo;
}
export declare type WCSSetState = (state: Partial<WCSState>) => void;
export declare type WCSSetFullState = (state: WCSState) => void;
export interface WCJSLocalState {
    account: string;
    connectionEat: number;
    connectionIat: number;
    connectionTimeout: number;
    figureConnected: boolean;
    newAccount: false;
    signedJWT: string;
    walletApp?: WalletId | '';
}
