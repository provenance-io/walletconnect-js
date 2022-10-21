import events from 'events';
import type {
  AccountInfo,
  AccountObject,
  Broadcast,
  BroadcastResults,
  GasPrice,
  WalletConnectClientType,
  WalletInfo,
  WCJSLocalState,
  WCSSetFullState,
  WCSSetState,
  WCSState,
} from '../types';
import {
  WINDOW_MESSAGES,
  CONNECTION_TIMEOUT,
  WALLETCONNECT_BRIDGE_URL,
} from '../consts';
import {
  connect as connectMethod,
  sendMessage as sendMessageMethod,
  signJWT as signJWTMethod,
  signMessage as signMessageMethod,
} from './methods';
import { getFromLocalStorage, addToLocalStorage, isMobile } from '../utils';

// Check for existing values from localStorage
const existingWCState: WalletConnectClientType =
  getFromLocalStorage('walletconnect');
const existingWCJSState: WCJSLocalState = getFromLocalStorage('walletconnect-js');

const defaultState: WCSState = {
  account: '',
  address: '',
  bridge: WALLETCONNECT_BRIDGE_URL,
  connected: false,
  connectionEXP: null,
  connectionEST: null,
  connectionTimeout: CONNECTION_TIMEOUT,
  connector: null,
  figureConnected: false,
  isMobile: isMobile(),
  loading: '',
  newAccount: false,
  peer: null,
  publicKey: '',
  QRCode: '',
  QRCodeUrl: '',
  showQRCodeModal: false,
  signedJWT: '',
  walletApp: '',
  walletInfo: {},
};

// Pull values out of local storage if they exist
const getAccountItem = (itemName: keyof AccountObject) => {
  const accounts = existingWCState.accounts as AccountInfo;
  // Make sure accounts exist
  if (!accounts || !Array.isArray(accounts) || !accounts.length) return '';
  // Check the accounts type, array of strings vs array of single object
  const firstValue = accounts[0];
  const accountArrayType = typeof firstValue === 'string'; // [ address, publicKey, jwt ]
  if (accountArrayType) {
    const accountsArray = accounts as string[];
    switch (itemName) {
      case 'address':
        return accountsArray[0];
      case 'publicKey':
        return accountsArray[1];
      case 'jwt':
        return accountsArray[2];
      // No walletInfo in old array method
      case 'walletInfo':
        return {};
      default:
        return '';
    }
  }
  const accountsObj = accounts[0] as AccountObject;
  return accountsObj[itemName];
};

const initialState: WCSState = {
  account: existingWCJSState.account || defaultState.account,
  address: (getAccountItem('address') as string) || defaultState.address,
  bridge: existingWCState.bridge || defaultState.bridge,
  connected: existingWCState.connected || defaultState.connected,
  connectionEXP: existingWCJSState.connectionEXP || defaultState.connectionEXP,
  connectionEST: existingWCJSState.connectionEST || defaultState.connectionEST,
  connectionTimeout:
    existingWCJSState.connectionTimeout || defaultState.connectionTimeout,
  connector: existingWCState || defaultState.connector,
  figureConnected: !!existingWCJSState.account && defaultState.connected,
  isMobile: defaultState.isMobile,
  loading: defaultState.loading,
  newAccount: existingWCJSState.newAccount || defaultState.newAccount,
  peer: defaultState.peer,
  publicKey: (getAccountItem('publicKey') as string) || defaultState.publicKey,
  QRCode: defaultState.QRCode,
  QRCodeUrl: defaultState.QRCodeUrl,
  showQRCodeModal: defaultState.showQRCodeModal,
  signedJWT:
    existingWCJSState.signedJWT ||
    (getAccountItem('jwt') as string) ||
    defaultState.signedJWT,
  walletApp: existingWCJSState.walletApp || defaultState.walletApp,
  walletInfo:
    (getAccountItem('walletInfo') as WalletInfo) || defaultState.walletInfo,
};

export class WalletConnectService {
  #eventEmitter = new events.EventEmitter();

  #setWalletConnectState: WCSSetFullState | undefined = undefined;

  #connectionTimer = 0;

  state: WCSState = { ...initialState };

  // *** Event Listener *** (https://nodejs.org/api/events.html)
  // Instead of having to use walletConnectService.eventEmitter.addListener()
  // We want to be able to use walletConnectService.addListener() to pass the arguments directly into eventEmitter
  #broadcastEvent: Broadcast = (eventName, data) => {
    this.#eventEmitter.emit(eventName, data);
  };

  addListener(eventName: string, callback: (results: BroadcastResults) => void) {
    this.#eventEmitter.addListener(eventName, callback);
  }

  on(eventName: string, callback: () => void) {
    this.#eventEmitter.addListener(eventName, callback);
  }

  removeListener(eventName: string, callback: (results: BroadcastResults) => void) {
    this.#eventEmitter.removeListener(eventName, callback);
  }

  removeAllListeners() {
    this.#eventEmitter.eventNames().forEach((eventName) => {
      this.#eventEmitter.removeAllListeners(eventName);
    });
  }

  // Pull latest state values on demand (prevent stale state in callback events)
  #getState = () => this.state;

  // Control auto-disconnect / timeout
  #startConnectionTimer = () => {
    // Can't start a timer if one is already running (make sure we have Eat and Iat too)
    if (
      !this.#connectionTimer &&
      this.state.connectionEXP &&
      this.state.connectionEST
    ) {
      // Get the time until expiration (typically this.state.connectionTimeout, but might not be if session restored from refresh)
      const connectionTimeout = this.state.connectionEXP - this.state.connectionEST;
      // Create a new timer
      const newConnectionTimer = window.setTimeout(() => {
        // When this timer expires, kill the session
        this.disconnect();
      }, connectionTimeout);
      // Save this timer (so it can be deleted on a reset)
      this.#connectionTimer = newConnectionTimer;
    }
  };

  resetConnectionTimeout = () => {
    // Kill the last timer (if it exists)
    if (this.#connectionTimer) window.clearTimeout(this.#connectionTimer);
    // Build a new connectionEST
    const connectionEST = Date.now();
    // Build a new connectionEXP (Iat + connectionTimeout)
    const connectionEXP = this.state.connectionTimeout + connectionEST;
    // Save these new values (needed for session restore functionality/page refresh)
    this.setState({ connectionEST, connectionEXP });
    // Start a new timer
    this.#startConnectionTimer();
  };

  updateState(): void {
    if (this.#setWalletConnectState) {
      this.#setWalletConnectState({
        ...this.state,
      });
    }
  }

  setStateUpdater(setWalletConnectState: WCSSetFullState): void {
    this.#setWalletConnectState = setWalletConnectState;
  }

  resetState = () => {
    this.state = { ...defaultState };
    this.updateState();
  };

  #updateLocalStorage = (updatedState: Partial<WCSState>) => {
    // Special values to look for
    const {
      account,
      connectionEXP,
      connectionEST,
      connectionTimeout,
      figureConnected,
      newAccount,
      signedJWT,
      walletApp,
    } = updatedState;
    // If the value was changed, add it to the localStorage updates
    const storageUpdates = {
      ...(account !== undefined && { account }),
      ...(connectionEXP !== undefined && { connectionEXP }),
      ...(connectionEST !== undefined && { connectionEST }),
      ...(connectionTimeout !== undefined && { connectionTimeout }),
      ...(figureConnected !== undefined && { figureConnected }),
      ...(newAccount !== undefined && { newAccount }),
      ...(signedJWT !== undefined && { signedJWT }),
      ...(walletApp !== undefined && { walletApp }),
    };
    // If we have updated 1 or more special values, update localStorage
    if (Object.keys(storageUpdates).length) {
      addToLocalStorage('walletconnect-js', storageUpdates);
    }
  };

  setState: WCSSetState = (updatedState) => {
    // Check if connected and account exists to update 'figureConnected' state
    const figureConnected =
      (!!this.state.account || !!updatedState.account) &&
      (!!this.state.connected || !!updatedState.connected);
    // Loop through each to update
    this.state = { ...this.state, ...updatedState, figureConnected };
    this.updateState();
    // Write state changes into localStorage as needed
    this.#updateLocalStorage({ ...updatedState, figureConnected });
  };

  showQRCode = (value: boolean) => {
    this.setState({ showQRCodeModal: value });
  };

  // All Wallet Methods here
  // - Connect
  // - SendMessage
  // - Disconnect
  // - Sign JWT
  // - Sign Message

  /**
   *
   * @param customBridge (optional) URL string of bridge to connect into
   */
  connect = async (customBridge?: string) => {
    await connectMethod({
      state: this.state,
      setState: this.setState,
      resetState: this.resetState,
      broadcast: this.#broadcastEvent,
      customBridge,
      startConnectionTimer: this.#startConnectionTimer,
      getState: this.#getState,
    });
  };

  disconnect = async () => {
    if (this?.state?.connector) await this.state.connector.killSession();
  };

  /**
   *
   * @param message Raw Base64 encoded msgAny string
   * @param description (optional) Additional information for wallet to display
   * @param method (optional) What method is used to send this message
   * @param gasPrice (optional) Gas price object to use
   */
  sendMessage = async (
    message: string | string[],
    description?: string,
    gasPrice?: GasPrice,
    method?: string
  ) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'sendMessage' });
    const result = await sendMessageMethod(this.state, {
      message,
      description,
      gasPrice,
      method,
    });
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error
      ? WINDOW_MESSAGES.SEND_MESSAGE_FAILED
      : WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();
  };

  /**
   *
   * @param expires Time from now in seconds to expire new JWT
   */
  signJWT = async (expires: number) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'signJWT' });
    const result = await signJWTMethod(this.state, this.setState, expires);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error
      ? WINDOW_MESSAGES.SIGN_JWT_FAILED
      : WINDOW_MESSAGES.SIGN_JWT_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();
  };

  signMessage = async (customMessage: string) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'signMessage' });
    // Get result back from mobile actions and wc
    const result = await signMessageMethod(this.state, customMessage);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error
      ? WINDOW_MESSAGES.SIGNATURE_FAILED
      : WINDOW_MESSAGES.SIGNATURE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();
  };
}
