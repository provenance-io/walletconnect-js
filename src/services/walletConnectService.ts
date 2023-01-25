import { Buffer } from 'buffer';
import events from 'events';
import type {
  AccountInfo,
  AccountObject,
  Broadcast,
  BroadcastResult,
  MethodSendMessageData,
  WalletConnectClientType,
  WalletInfo,
  MasterGroupPolicy,
  WCJSLocalState,
  WCSSetFullState,
  WCSSetState,
  WCSState,
} from '../types';
import {
  WINDOW_MESSAGES,
  WALLET_APP_EVENTS,
  CONNECTION_TIMEOUT,
  WALLETCONNECT_BRIDGE_URL,
} from '../consts';
import {
  sendMessage as sendMessageMethod,
  signJWT as signJWTMethod,
  signMessage as signMessageMethod,
  createConnector,
  createConnectorEvents,
  updateService,
} from './methods';
import {
  getFromLocalStorage,
  addToLocalStorage,
  isMobile,
  sendWalletEvent,
} from '../utils';

// If we don't have a value for Buffer (node core module) create it/polyfill it
if (window.Buffer === undefined) window.Buffer = Buffer;

// Check for existing values from localStorage
const existingWCState: WalletConnectClientType =
  getFromLocalStorage('walletconnect');
const existingWCJSState: WCJSLocalState = getFromLocalStorage('walletconnect-js');

const defaultState: WCSState = {
  account: '',
  address: '',
  bridge: WALLETCONNECT_BRIDGE_URL,
  connected: false,
  connectionEST: null,
  connectionEXP: null,
  connectionPending: true,
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
  representedGroupPolicy: null,
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
      // No representedGroupPolicy in old array method
      case 'representedGroupPolicy':
        return null;
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
  connected: defaultState.connected,
  connectionEXP: existingWCJSState.connectionEXP || defaultState.connectionEXP,
  connectionEST: existingWCJSState.connectionEST || defaultState.connectionEST,
  connectionPending: defaultState.connectionPending,
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
  representedGroupPolicy:
    (getAccountItem('representedGroupPolicy') as MasterGroupPolicy) ||
    defaultState.representedGroupPolicy,
};

export class WalletConnectService {
  #connectionTimer = 0;

  #eventEmitter = new events.EventEmitter();

  #setWalletConnectState: WCSSetFullState | undefined = undefined;

  state: WCSState = { ...initialState };

  // *** Event Listener *** (https://nodejs.org/api/events.html)
  // Instead of having to use walletConnectService.eventEmitter.addListener()
  // We want to be able to use walletConnectService.addListener() to pass the arguments directly into eventEmitter
  #broadcastEvent: Broadcast = (eventName, data) => {
    this.#eventEmitter.emit(eventName, data);
  };

  // Stop the current running connection timer
  #clearConnectionTimer = () => {
    if (this.#connectionTimer) {
      // Stop timer
      window.clearTimeout(this.#connectionTimer);
      // Reset timer value to 0
      this.#connectionTimer = 0;
    }
  };

  // Pull latest state values on demand (prevent stale state in callback events)
  #getState = () => this.state;

  // Control auto-disconnect / timeout
  #startConnectionTimer = () => {
    // Can't start a timer if one is already running (make sure we have EXP and EST too)
    if (
      !this.#connectionTimer &&
      this.state.connectionEXP &&
      this.state.connectionEST
    ) {
      // Get the time until expiration (typically this.state.connectionTimeout, but might not be if session restored from refresh)
      const connectionTimeout = this.state.connectionEXP - Date.now();
      // Create a new timer
      const newConnectionTimer = window.setTimeout(() => {
        // When this timer expires, kill the session
        this.disconnect();
      }, connectionTimeout);
      // Save this timer (so it can be deleted on a reset)
      this.#connectionTimer = newConnectionTimer;
    }
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

  // Create listeners used with eventEmitter/broadcast results
  addListener(eventName: string, callback: (results: BroadcastResult) => void) {
    this.#eventEmitter.addListener(eventName, callback);
  }

  // Clone of addListener function
  on(eventName: string, callback: () => void) {
    this.#eventEmitter.addListener(eventName, callback);
  }

  // Remove all listeners used with eventEmitter/broadcast results
  removeAllListeners() {
    this.#eventEmitter.eventNames().forEach((eventName) => {
      this.#eventEmitter.removeAllListeners(eventName);
    });
  }

  // Remove listener w/specific eventName used with eventEmitter/broadcast results
  removeListener(eventName: string, callback: (results: BroadcastResult) => void) {
    this.#eventEmitter.removeListener(eventName, callback);
  }

  /**
   *
   * @param connectionTimeout (optional) Seconds to bump the connection timeout by
   */
  resetConnectionTimeout = (connectionTimeout?: number) => {
    // Use the new (convert to ms) or existing connection timeout
    const newConnectionTimeout = connectionTimeout
      ? connectionTimeout * 1000
      : this.state.connectionTimeout;
    // Kill the last timer (if it exists)
    this.#clearConnectionTimer();
    // Build a new connectionEXP (Iat + connectionTimeout)
    const connectionEXP = newConnectionTimeout + Date.now();
    // Save these new values (needed for session restore functionality/page refresh)
    this.setState({ connectionTimeout: newConnectionTimeout, connectionEXP });
    // Start a new timer
    this.#startConnectionTimer();
    // Send connected wallet custom event with the new connection details
    if (this.state.walletApp) {
      sendWalletEvent(
        this.state.walletApp,
        WALLET_APP_EVENTS.RESET_TIMEOUT,
        newConnectionTimeout
      );
    }
  };

  // Reset walletConnectService state back to the original default state
  resetState = () => {
    this.state = { ...defaultState };
    this.updateState();
  };

  // Change the class state
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

  // Create a stateUpdater, used for context to be able to auto change this class state
  setStateUpdater(setWalletConnectState: WCSSetFullState): void {
    this.#setWalletConnectState = setWalletConnectState;
  }

  // Show/Hide the QrCodeModal (just a state value passed into the Component)
  showQRCode = (value: boolean) => {
    this.setState({ showQRCodeModal: value });
  };

  // Update the class object to reflect the latest state changes
  updateState(): void {
    if (this.#setWalletConnectState) {
      this.#setWalletConnectState({
        ...this.state,
      });
    }
  }

  /**
   * @param bridge - (optional) URL string of bridge to connect into
   * @param duration - (optional) Time before connection is timed out (seconds)
   * @param noPopup - (optional) Prevent the QRCodeModal from automatically popping up
   * @param address - (optional) Address to establish connection with, note, it must exist
   * @param prohibitGroups - (optional) Does this dApp ban group accounts connecting to it
   */
  connect = async ({
    bridge,
    duration,
    noPopup,
    address,
    prohibitGroups,
  }: {
    bridge?: string;
    duration?: number;
    noPopup?: boolean;
    address?: string;
    prohibitGroups?: boolean;
  } = {}) => {
    // Update the duration of this connection
    this.setState({
      connectionTimeout: duration ? duration * 1000 : this.state.connectionTimeout,
      connectionPending: true,
    });
    // Build the new connector
    const newConnector = createConnector({
      requiredAddress: address,
      bridge: bridge || this.state.bridge,
      noPopup,
      prohibitGroups,
      setState: this.setState,
    });
    // Set up all connector event listeners
    createConnectorEvents({
      bridge: bridge || this.state.bridge,
      broadcast: this.#broadcastEvent,
      connector: newConnector,
      getState: this.#getState,
      resetState: this.resetState,
      setState: this.setState,
      startConnectionTimer: this.#startConnectionTimer,
      state: this.state,
    });
    // Update the state based on the newConnector information
    updateService({
      broadcast: this.#broadcastEvent,
      connector: newConnector,
      setState: this.setState,
      startConnectionTimer: this.#startConnectionTimer,
      state: this.state,
    });
    if (!newConnector.connected) newConnector.createSession();
    this.setState({
      connectionPending: false,
    });
    return '';
  };

  disconnect = async () => {
    if (this?.state?.connector) await this.state.connector.killSession();
    return;
  };

  /**
   *
   * @param message Raw Base64 encoded msgAny string
   * @param description (optional) Additional information for wallet to display
   * @param method (optional) What method is used to send this message
   * @param gasPrice (optional) Gas price object to use
   * @param feeGranter (optional) Specify a fee granter address
   * @param feePayer (optional) Specify a fee payer address
   * @param memo (optional) Tx body memo
   * @param timeoutHeight (optional) Tx body timeoutHeight
   * @param extensionOptions (optional) Tx body extensionOptions
   * @param nonCriticalExtensionOptions (optional) Tx body nonCriticalExtensionOptions
   */
  sendMessage = async ({
    message,
    description,
    gasPrice,
    method,
    feeGranter,
    feePayer,
    timeoutHeight,
    extensionOptions,
    nonCriticalExtensionOptions,
    memo,
  }: MethodSendMessageData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'sendMessage' });
    const result = await sendMessageMethod(this.state, {
      message,
      description,
      gasPrice,
      method,
      feeGranter,
      feePayer,
      timeoutHeight,
      extensionOptions,
      nonCriticalExtensionOptions,
      memo,
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

    return result;
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
    return result;
  };

  /**
   *
   * @param customMessage Message you want the wallet to sign
   */
  signMessage = async (customMessage: string) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'signMessage' });
    // Get result back from mobile actions and wc
    const result = await signMessageMethod(this.state, customMessage);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error
      ? WINDOW_MESSAGES.SIGN_MESSAGE_FAILED
      : WINDOW_MESSAGES.SIGN_MESSAGE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();

    return result;
  };
}
