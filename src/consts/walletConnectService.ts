import { AccountAttribute } from '../types';
import { isMobile } from '../utils';
import { CONNECTION_TIMEOUT } from './connectionTimeouts';
import { WALLETCONNECT_BRIDGE_URL } from './urls';

export const WCS_DEFAULT_STATE = {
  connection: {
    bridge: WALLETCONNECT_BRIDGE_URL,
    status: 'disconnected',
    connectionEST: null,
    connectionEXP: null,
    connectionTimeout: CONNECTION_TIMEOUT,
    onDisconnect: undefined,
    peer: null,
    walletAppId: undefined,
  },
  wallet: {
    address: '',
    attributes: [] as AccountAttribute[],
    publicKey: '',
    representedGroupPolicy: null,
    signedJWT: '',
    coin: undefined,
    id: undefined,
    name: undefined,
  },
  modal: {
    showModal: false,
    isMobile: isMobile(),
    dynamicUrl: '',
    QRCodeImg: '',
    QRCodeUrl: '',
  },
  pendingMethod: '',
} as const;
