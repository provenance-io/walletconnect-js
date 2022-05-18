import events from 'events';
import WalletConnectClient from "@walletconnect/client";
import {
  Broadcast,
  BroadcastResults,
  CustomActionData,
  IClientMeta,
  MarkerAddData,
  MarkerData,
  SendCoinData,
  SendHashBatchData,
  SendHashData,
  AccountInfo,
  AccountObject,
  WalletInfo
} from 'types';
import { WINDOW_MESSAGES, WALLETCONNECT_BRIDGE_URL, CONNECTION_TIMEOUT } from '../consts';
import {
  markerActivate as markerActivateMethod,
  markerAdd as markerAddMethod,
  cancelRequest as cancelRequestMethod,
  connect as connectMethod,
  customAction as customActionMethod,
  delegateHash as delegateHashMethod,
  sendCoin as sendCoinMethod,
  sendHash as sendHashMethod,
  signJWT as signJWTMethod,
  signMessage as signMessageMethod,
  sendHashBatch as sendHashBatchMethod,
  markerFinalize as markerFinalizeMethod,
} from './methods';
import { getFromLocalStorage, addToLocalStorage, isMobile } from '../utils';

interface WCJSState {
  account: string,
  connectionEat: number,
  connectionIat: number,
  connectionTimeout: number,
  connectionType: string,
  extensionId: string,
  figureConnected: boolean,
  newAccount: false,
  signedJWT: string,
}

// Check for existing values from localStorage
const existingWCState:WalletConnectClient = getFromLocalStorage('walletconnect');
const existingWCJSState: WCJSState = getFromLocalStorage('walletconnect-js');

export interface State {
  account: string,
  address: string,
  assets: string[],
  connected: boolean,
  connectionEat: number | null,
  connectionIat: number | null,
  connectionTimeout: number,
  connectionType: string,
  connector: WalletConnectClient | null,
  extensionId: string,
  figureConnected: boolean,
  isMobile: boolean,
  loading: string,
  newAccount: boolean,
  peer: IClientMeta | null,
  publicKey: string,
  QRCode: string
  QRCodeUrl: string,
  showQRCodeModal: boolean,
  signedJWT: string,
  walletInfo: WalletInfo,
}

export type SetState = (state: Partial<State>) => void;
export type SetFullState = (state:State) => void;

const defaultState: State = {
  account: '',
  address: '',
  assets: [],
  connected: false,
  connectionEat: null,
  connectionIat: null,
  connectionTimeout: CONNECTION_TIMEOUT,
  connectionType: '',
  connector: null,
  extensionId: '',
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
      case 'address': return accountsArray[0];
      case 'publicKey': return accountsArray[1];
      case 'jwt': return accountsArray[2];
      // No walletInfo in old array method
      case 'walletInfo': return {};
      default: return '';
    }
  }
  const accountsObj = accounts[0] as AccountObject;
  return accountsObj[itemName];
}

const initialState: State = {
  account: existingWCJSState.account || defaultState.account,
  address: getAccountItem('address') as string || defaultState.address,
  assets: defaultState.assets,
  connected: existingWCState.connected || defaultState.connected,
  connectionEat: existingWCJSState.connectionEat || defaultState.connectionEat,
  connectionIat: existingWCJSState.connectionIat || defaultState.connectionIat,
  connectionTimeout: existingWCJSState.connectionTimeout || defaultState.connectionTimeout,
  connectionType: existingWCJSState.connectionType || defaultState.connectionType,
  connector: existingWCState || defaultState.connector,
  extensionId: existingWCJSState.extensionId || defaultState.extensionId,
  figureConnected: !!existingWCJSState.account && defaultState.connected,
  isMobile: defaultState.isMobile,
  loading: defaultState.loading,
  newAccount: existingWCJSState.newAccount || defaultState.newAccount,
  peer: defaultState.peer,
  publicKey: getAccountItem('publicKey') as string || defaultState.publicKey,
  QRCode: defaultState.QRCode,
  QRCodeUrl: defaultState.QRCodeUrl,
  showQRCodeModal: defaultState.showQRCodeModal,
  signedJWT: getAccountItem('jwt') as string || defaultState.signedJWT,
  walletInfo: getAccountItem('walletInfo') as WalletInfo || defaultState.walletInfo,
};

export class WalletConnectService {
  #eventEmitter = new events.EventEmitter();

  #setWalletConnectState: SetFullState | undefined = undefined;
  
  #network = 'mainnet';

  #connectionTimer = 0;

  #bridge: string = WALLETCONNECT_BRIDGE_URL;

  state: State = { ...initialState };

  // *** Event Listener *** (https://nodejs.org/api/events.html)
  // Instead of having to use walletConnectService.eventEmitter.addListener()
  // We want to be able to use walletConnectService.addListener() to pass the arguments directly into eventEmitter
  #broadcastEvent: Broadcast = (eventName, data) => {
    this.#eventEmitter.emit(eventName, data);
  }
  
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
    this.#eventEmitter.eventNames().forEach(eventName => {
      this.#eventEmitter.removeAllListeners(eventName);
    })
  }
  
  // Control auto-disconnect / timeout
  #startConnectionTimer = () => {
    // Can't start a timer if one is already running (make sure we have Eat and Iat too)
    if (!this.#connectionTimer && this.state.connectionEat && this.state.connectionIat) {
      // Get the time until expiration (typically this.state.connectionTimeout, but might not be if session restored from refresh)
      const connectionTimeout = this.state.connectionEat - this.state.connectionIat; 
      // Create a new timer
      const newConnectionTimer = window.setTimeout(() => {
        // When this timer expires, kill the session
        this.disconnect();
      }, (connectionTimeout * 1000)); // Convert to ms (timeout takes ms)
      // Save this timer (so it can be deleted on a reset)
      this.#connectionTimer = newConnectionTimer;
    }
  }

  #resetConnectionTimeout = () => {
    // Kill the last timer (if it exists)
    if (this.#connectionTimer) window.clearTimeout(this.#connectionTimer);
    // Build a new connectionIat (time now in seconds)
    const connectionIat = Math.floor(Date.now() / 1000);
    // Build a new connectionEat (Iat + connectionTimeout)
    const connectionEat = this.state.connectionTimeout + connectionIat;
    // Save these new values (needed for session restore functionality/page refresh)
    this.setState({ connectionIat, connectionEat });
    // Start a new timer
    this.#startConnectionTimer();
  }

  // Update the network and bridge by passing it through as a prop on the provider

  setNetwork(network: string) {
    this.#network = network;
  }

  setBridge(bridge: string) {
    this.#bridge = bridge;
  }

  updateState(): void {
    if (this.#setWalletConnectState) {
      this.#setWalletConnectState({
        ...this.state,
      });
    }
  }

  setStateUpdater(setWalletConnectState: SetFullState): void {
    this.#setWalletConnectState = setWalletConnectState;
  }

  resetState = () => {
    this.state = { ...defaultState };
    this.updateState();
  }

  #updateLocalStorage = (updatedState: Partial<State>) => {
    // Special values to look for
    const {
      account,
      connectionEat,
      connectionIat,
      connectionTimeout,
      connectionType,
      extensionId,
      figureConnected,
      newAccount,
      signedJWT,
    } = updatedState;
    // If the value was changed, add it to the localStorage updates
    const storageUpdates = {
      ...(account !== undefined && {account}),
      ...(connectionEat !== undefined && {connectionEat}),
      ...(connectionIat !== undefined && {connectionIat}),
      ...(connectionTimeout !== undefined && {connectionTimeout}),
      ...(connectionType !== undefined && {connectionType}),
      ...(extensionId !== undefined && {extensionId}),
      ...(figureConnected !== undefined && {figureConnected}),
      ...(newAccount !== undefined && {newAccount}),
      ...(signedJWT !== undefined && {signedJWT}),
    };
    // If we have updated 1 or more special values, update localStorage
    if (Object.keys(storageUpdates).length) {
      addToLocalStorage('walletconnect-js', storageUpdates);
    }
  }

  setState: SetState = (updatedState) => {
    // Check if connected and account exists to update 'figureConnected' state
    const figureConnected = (!!this.state.account || !!updatedState.account) && (!!this.state.connected || !!updatedState.connected);
    // Loop through each to update
    this.state =  {...this.state, ...updatedState, figureConnected};
    this.updateState();
    // Write state changes into localStorage as needed
    this.#updateLocalStorage({...updatedState, figureConnected});
  };

  showQRCode = (value: boolean) => {
    this.setState({ showQRCodeModal: value })
  }
  
  // All Wallet Methods here
  // - Marker Activate
  // - Marker Add
  // - Cancel Request
  // - Connect
  // - CustomAction
  // - Delegate Hash
  // - Disconnect
  // - Send Hash
  // - Sign JWT
  // - Sign Message
  
  markerActivate = async (data: MarkerData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'markerActivate' });
    const result = await markerActivateMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.MARKER_ACTIVATE_FAILED : WINDOW_MESSAGES.MARKER_ACTIVATE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }
  
  markerFinalize = async (data: MarkerData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'markerFinalize' });
    const result = await markerFinalizeMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.MARKER_FINALIZE_FAILED : WINDOW_MESSAGES.MARKER_FINALIZE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }
  
  markerAdd = async (data: MarkerAddData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'markerAdd' });
    const result = await markerAddMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.MARKER_ADD_FAILED : WINDOW_MESSAGES.MARKER_ADD_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }

  cancelRequest = async (denom: string) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'cancelRequest' });
    const result = await cancelRequestMethod(this.state, denom);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.CANCEL_REQUEST_FAILED : WINDOW_MESSAGES.CANCEL_REQUEST_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }

  connect = async () => {
    await connectMethod({
      state: this.state,
      setState: this.setState,
      resetState: this.resetState,
      broadcast: this.#broadcastEvent,
      bridge: this.#bridge,
      startConnectionTimer: this.#startConnectionTimer,
    });
  }

  customAction = async (data: CustomActionData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'customAction' });
    const result = await customActionMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.CUSTOM_ACTION_FAILED : WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }

  delegateHash = async (data: SendHashData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'delegateHash' });
    const result = await delegateHashMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.DELEGATE_HASH_FAILED : WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }

  disconnect = async () => {
    if (this?.state?.connector) await this.state.connector.killSession();
  }

  sendCoin = async (data: SendCoinData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'sendCoin' });
    const result = await sendCoinMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.TRANSACTION_FAILED : WINDOW_MESSAGES.TRANSACTION_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }
  
  /**
   * @deprecated The method should no longer used, use sendCoin instead
   */
  sendHash = async (data: SendHashData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'sendHash' });
    const result = await sendHashMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.TRANSACTION_FAILED : WINDOW_MESSAGES.TRANSACTION_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }
  
  sendHashBatch = async (data: SendHashBatchData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'sendHashBatch' });
    const result = await sendHashBatchMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.TRANSACTION_FAILED : WINDOW_MESSAGES.TRANSACTION_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }

  signJWT = async (expires: string) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'signJWT' });
    const result = await signJWTMethod(this.state, this.setState, +expires);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.SIGN_JWT_FAILED : WINDOW_MESSAGES.SIGN_JWT_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }

  signMessage = async (customMessage: string) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'signMessage' });
    // Get result back from mobile actions and wc
    const result = await signMessageMethod(this.state, customMessage);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.SIGNATURE_FAILED : WINDOW_MESSAGES.SIGNATURE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.#resetConnectionTimeout();
  }
}
