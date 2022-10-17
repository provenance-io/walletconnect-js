export declare type EventValue = 'walletconnect_event' | 'walletconnect_init' | 'walletconnect_disconnect';
export declare type WalletType = 'mobile' | 'extension' | 'web';
export declare type WalletId = 'provenance_extension' | 'provenance_mobile' | 'figure_web';
export declare type WalletIcons = 'provenance' | 'figure' | 'unicorn';
export interface EventData {
    event?: EventValue;
    uri?: string;
    address?: string;
}
export interface Wallet {
    dev?: boolean;
    dynamicUrl?: string;
    eventAction?: (eventData: EventData) => void;
    generateUrl?: (QRCodeUrl: string) => Promise<string>;
    icon?: WalletIcons;
    id: WalletId;
    title: string;
    type: WalletType;
    walletCheck?: () => boolean;
    walletUrl?: string;
}
export declare type WalletList = Wallet[];
