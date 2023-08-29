import { AccountAttribute, WCSState } from '../types';
import { isMobile } from '../utils';
import { CONNECTION_TIMEOUT } from './connectionTimeouts';
import { WALLETCONNECT_BRIDGE_URL } from './urls';

export const WCS_DEFAULT_STATE: WCSState = {
  connection: {
    bridge: WALLETCONNECT_BRIDGE_URL,
    est: undefined,
    exp: undefined,
    timeout: CONNECTION_TIMEOUT,
    type: undefined,
    onDisconnect: undefined,
    peer: undefined,
    pendingMethod: undefined,
    status: 'disconnected',
    walletAppId: undefined,
  },
  modal: {
    dynamicUrl: undefined,
    isMobile: isMobile(),
    QRCodeImg: undefined,
    QRCodeUrl: undefined,
    show: false,
  },
  wallet: {
    address: undefined,
    attributes: [] as AccountAttribute[],
    coin: undefined,
    id: undefined,
    name: undefined,
    publicKey: undefined,
    representedGroupPolicy: undefined,
    signedJWT: undefined,
  },
} as const;
