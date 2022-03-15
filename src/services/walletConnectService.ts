import events from 'events';
import WalletConnectClient from "@walletconnect/client";
import {
  Broadcast,
  IClientMeta,
  CustomActionData,
  SendCoinData,
  SendHashData,
  SendHashBatchData,
  BroadcastResults,
  SignJWTData,
} from 'types';
import { WINDOW_MESSAGES, WALLETCONNECT_BRIDGE_URL, CONNECTION_TIMEOUT } from '../consts';
import {
  activateRequest as activateRequestMethod,
  addMarker as addMarkerMethod,
  cancelRequest as cancelRequestMethod,
  connect as connectMethod,
  customAction as customActionMethod,
  delegateHash as delegateHashMethod,
  sendCoin as sendCoinMethod,
  sendHash as sendHashMethod,
  signJWT as signJWTMethod,
  signMessage as signMessageMethod,
  sendHashBatch as sendHashBatchMethod,
} from './methods';
import { getFromLocalStorage, addToLocalStorage, isMobile } from '../utils';

// Check for existing values from localStorage
const existingWCState = getFromLocalStorage('walletconnect');
const existingWCJSState = getFromLocalStorage('walletconnect-js');

export interface State {
  account: string,
  address: string,
  assets: string[],
  connected: boolean,
  connectionIat: number | null,
  connector: WalletConnectClient | null,
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
}

export type SetState = (state: Partial<State>) => void;
export type SetFullState = (state:State) => void;

const defaultState: State = {
  account: '',
  address: '',
  assets: [],
  connected: false,
  connectionIat: null,
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
};

const initialState: State = {
  account: existingWCJSState.account || defaultState.account,
  address: existingWCState?.accounts && existingWCState.accounts[0] || defaultState.address,
  assets: defaultState.assets,
  connected: defaultState.connected,
  connectionIat: existingWCJSState.connectionIat || defaultState.connectionIat,
  connector: defaultState.connector,
  figureConnected: !!existingWCJSState.account && defaultState.connected,
  isMobile: defaultState.isMobile,
  loading: defaultState.loading,
  newAccount: existingWCJSState.newAccount || defaultState.newAccount,
  peer: defaultState.peer,
  publicKey: existingWCState?.accounts && existingWCState.accounts[1] || defaultState.publicKey,
  QRCode: defaultState.QRCode,
  QRCodeUrl: defaultState.QRCodeUrl,
  showQRCodeModal: defaultState.showQRCodeModal,
  signedJWT: existingWCJSState.signedJWT || defaultState.signedJWT,
};

export class WalletConnectService {
  #eventEmitter = new events.EventEmitter();

  #setWalletConnectState: SetFullState | undefined = undefined;
  
  #network = 'mainnet';

  #connectionTimeout = CONNECTION_TIMEOUT;

  #bridge: string = WALLETCONNECT_BRIDGE_URL;

  state: State = { ...initialState };

  // *** Event Listener *** (https://nodejs.org/api/events.html)
  // Instead of having to use walletConnectService.eventEmitter.addListener()
  // We want to be able to use walletConnectService.addListener() to pass the arguments directly into eventEmitter
  #broadcastEvent: Broadcast = (eventName, params) => {
    this.#eventEmitter.emit(eventName, params);
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
  
  // Update the network and bridge by passing it through as a prop on the provider

  setNetwork(network: string) {
    this.#network = network;
  }

  setBridge(bridge: string) {
    this.#bridge = bridge;
  }

  setConnectionTimeout(timeout: number) {
    this.#connectionTimeout = timeout;
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
    const { connectionIat, account, newAccount, figureConnected, signedJWT } = updatedState;
    // If the value was changed, add it to the localStorage updates
    const storageUpdates = {
      ...(connectionIat !== undefined && {connectionIat}),
      ...(account !== undefined && {account}),
      ...(newAccount !== undefined && {newAccount}),
      ...(figureConnected !== undefined && {figureConnected}),
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
  // - Activate Request
  // - Add Marker
  // - Cancel Request
  // - Connect
  // - CustomAction
  // - Delegate Hash
  // - Disconnect
  // - Send Hash
  // - Sign JWT
  // - Sign Message
  
  activateRequest = async (denom: string) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'activateRequest' });
    const result = await activateRequestMethod(this.state, denom);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.ACTIVATE_REQUEST_FAILED : WINDOW_MESSAGES.ACTIVATE_REQUEST_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
  }
  
  addMarker = async (data: { denom: string, amount: number }) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'addMarker' });
    const result = await addMarkerMethod(this.state, data);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.ADD_MARKER_FAILED : WINDOW_MESSAGES.ADD_MARKER_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
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
  }

  connect = () => {
    connectMethod(this.state, this.setState, this.resetState, this.#broadcastEvent, this.#bridge);   
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
  }

  disconnect = () => {
    if (this?.state?.connector) {
      this.state.connector.killSession();
    }
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
  }

  signJWT = async (expires: SignJWTData) => {
    // Loading while we wait for mobile to respond
    this.setState({ loading: 'signJWT' });
    const result = await signJWTMethod(this.state, this.setState, expires);
    // No longer loading
    this.setState({ loading: '' });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.SIGN_JWT_FAILED : WINDOW_MESSAGES.SIGN_JWT_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
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
  }
}
