import { WalletConnectService } from '../services';
export declare const useWalletConnectService: () => {
    walletConnectState: {
        account: string;
        address: string;
        bridge: string;
        connected: boolean;
        connectionEat: number | null;
        connectionIat: number | null;
        connectionTimeout: number;
        connector: import("@walletconnect/client").default | null;
        figureConnected: boolean;
        isMobile: boolean;
        loading: string;
        newAccount: boolean;
        peer: import("../types").IClientMeta | null;
        publicKey: string;
        QRCode: string;
        QRCodeUrl: string;
        showQRCodeModal: boolean;
        signedJWT: string;
        walletApp?: "" | import("../types").WalletId | undefined;
        walletInfo: import("../types").WalletInfo;
    };
    walletConnectService: WalletConnectService;
};
