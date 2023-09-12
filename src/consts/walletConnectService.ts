import { AccountAttribute, WCSState } from '../types';
import { isMobile } from '../utils';
import {
  DEFAULT_CONNECTION_DURATION,
  DEFAULT_JWT_DURATION,
} from './connectionTimeouts';
import { WALLETCONNECT_BRIDGE_URL } from './urls';

export const WCS_DEFAULT_STATE: WCSState = {
  connection: {
    bridge: WALLETCONNECT_BRIDGE_URL,
    est: undefined,
    exp: undefined,
    jwtDuration: DEFAULT_JWT_DURATION,
    connectionDuration: DEFAULT_CONNECTION_DURATION,
    type: undefined,
    onDisconnect: undefined,
    peer: undefined,
    pendingMethod: undefined,
    status: 'disconnected',
    walletId: undefined,
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

export const WCS_BACKUP_TIMER_INTERVAL = 3000; // 3s interval to check connection status
