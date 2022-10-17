import React from 'react';
import { WalletConnectService } from '../../services';
import { WalletId } from '../../types';
interface Props {
    className?: string;
    walletConnectService: WalletConnectService;
    title?: string;
    devWallets?: WalletId[];
}
export declare const QRCodeModal: React.FC<Props>;
export {};
