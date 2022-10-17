export declare type WalletInfo = {
    coin?: string;
    id?: number;
    name?: string;
};
export declare type AccountObject = {
    address: string;
    jwt: string;
    publicKey: string;
    walletInfo: WalletInfo;
};
export declare type AccountInfo = string[] | AccountObject[] | undefined;
export declare type ConnectData = {
    params: [
        {
            accounts: AccountInfo;
            peerMeta: {
                description: string;
                url: string;
                name: string;
                icons: string[];
            };
        }
    ];
};
