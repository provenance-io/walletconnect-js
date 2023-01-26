import { Buffer } from 'buffer';
import events from 'events';
import type {
  AccountInfo,
  AccountObject,
  Broadcast,
  BroadcastResult,
  MasterGroupPolicy,
  MethodSendMessageData,
  WalletConnectClientType,
  WalletInfo,
  WCJSLocalState,
  WCSSetFullState,
  WCSSetState,
  WCSState,
} from '../types';
import {
  CONNECTION_TIMEOUT,
  WALLET_APP_EVENTS,
  WALLETCONNECT_BRIDGE_URL,
  WINDOW_MESSAGES,
} from '../consts';
import {
  connect as connectMethod,
  sendMessage as sendMessageMethod,
  signJWT as signJWTMethod,
  signMessage as signMessageMethod,
} from './methods';
import {
  addToLocalStorage,
  clearLocalStorage,
  getAccountInfo,
  getFromLocalStorage,
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
  address: '',
  bridge: WALLETCONNECT_BRIDGE_URL,
  connected: false,
  connectionEST: null,
  connectionEXP: null,
  connectionPending: true,
  connectionTimeout: CONNECTION_TIMEOUT,
  connector: null,
  isMobile: isMobile(),
  loading: '',
  peer: null,
  publicKey: '',
  QRCode: '',
  QRCodeUrl: '',
  representedGroupPolicy: null,
  showQRCodeModal: false,
  signedJWT: '',
  walletAppId: '',
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
  address: (getAccountItem('address') as string) || defaultState.address,
  bridge: existingWCState.bridge || defaultState.bridge,
  connected: defaultState.connected,
  connectionEXP: existingWCJSState.connectionEXP || defaultState.connectionEXP,
  connectionEST: existingWCJSState.connectionEST || defaultState.connectionEST,
  connectionPending: defaultState.connectionPending,
  connectionTimeout:
    existingWCJSState.connectionTimeout || defaultState.connectionTimeout,
  connector: existingWCState || defaultState.connector,
  isMobile: defaultState.isMobile,
  loading: defaultState.loading,
  peer: defaultState.peer,
  publicKey: (getAccountItem('publicKey') as string) || defaultState.publicKey,
  QRCode: defaultState.QRCode,
  QRCodeUrl: defaultState.QRCodeUrl,
  showQRCodeModal: defaultState.showQRCodeModal,
  // Note: we are pulling from wcjs storage first incase the user generated a newer JWT since connecting
  signedJWT:
    existingWCJSState.signedJWT ||
    (getAccountItem('jwt') as string) ||
    defaultState.signedJWT,
  walletAppId: existingWCJSState.walletAppId || defaultState.walletAppId,
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
    console.log('wcjs | walletConnectService.ts | #broadcastEvent | params: ', {
      eventName,
      data,
    });
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
      connectionEXP,
      connectionEST,
      connectionTimeout,
      signedJWT,
      walletAppId,
    } = updatedState;
    // If the value was changed, add it to the localStorage updates
    const storageUpdates = {
      ...(connectionEXP !== undefined && { connectionEXP }),
      ...(connectionEST !== undefined && { connectionEST }),
      ...(connectionTimeout !== undefined && { connectionTimeout }),
      ...(signedJWT !== undefined && { signedJWT }),
      ...(walletAppId !== undefined && { walletAppId }),
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
    if (this.state.walletAppId) {
      sendWalletEvent(
        this.state.walletAppId,
        WALLET_APP_EVENTS.RESET_TIMEOUT,
        newConnectionTimeout
      );
    }
  };

  // Reset walletConnectService state back to the original default state
  resetState = () => {
    this.state = { ...defaultState };
    this.updateState();
    clearLocalStorage('walletconnect-js');
  };

  // Change the class state
  setState: WCSSetState = (updatedState) => {
    let finalUpdatedState = { ...updatedState };
    // If we get a new "connector" passed in, pull various data keys out before saving state
    if (updatedState.connector) {
      const { bridge, peerMeta, accounts } = updatedState.connector;
      const { address, jwt, publicKey, representedGroupPolicy, walletInfo } =
        getAccountInfo(accounts);
      finalUpdatedState = {
        ...updatedState,
        address,
        bridge,
        // We always want to use the jwt in the state over the connector since newer jwts won't show up in the connector
        signedJWT: this.state.signedJWT || jwt,
        publicKey,
        representedGroupPolicy,
        walletInfo,
        peer: peerMeta,
      };
    }
    console.log(
      'wcjs | walletConnectService.ts | setState | finalUpdatedState: ',
      finalUpdatedState
    );
    // Loop through each to update
    this.state = { ...this.state, ...finalUpdatedState };
    this.updateState();
    // Write state changes into localStorage as needed
    this.#updateLocalStorage(finalUpdatedState);
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
  connect = ({
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
    connectMethod({
      bridge: bridge || this.state.bridge,
      broadcast: this.#broadcastEvent,
      getState: this.#getState,
      noPopup,
      prohibitGroups,
      requiredAddress: address,
      resetState: this.resetState,
      setState: this.setState,
      startConnectionTimer: this.#startConnectionTimer,
      state: this.state,
    });
    this.setState({
      connectionPending: false,
    });
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
