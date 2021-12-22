import events from 'events';
import { WINDOW_MESSAGES, CONNECTION_TIMEOUT } from '../consts';
import {
  connect as connectMethod,
  signMessage as signMessageMethod,
  sendHash as sendHashMethod,
  signJWT as signJWTMethod,
  delegateHash as delegateHashMethod,
} from './methods';
import { getFromLocalStorage, addToLocalStorage } from '../utils';

// Check for existing values from localStorage
const existingWCState = getFromLocalStorage('walletconnect');
const existingWCJSState = getFromLocalStorage('walletconnect-js');

const defaultState = {
  account: '',
  newAccount: false,
  address: '',
  assets: [],
  assetsPending: false,
  connected: false,
  connector: null,
  connectionIat: '',
  delegateHashLoading: false,
  peer: {},
  publicKey: '',
  QRCode: '',
  sendHashLoading: false,
  showQRCodeModal: false,
  signedJWT: '',
  signJWTLoading: false,
  signMessageLoading: false,
};

const initialState = {
  account: existingWCJSState.account || defaultState.account,
  address: existingWCState?.accounts && existingWCState.accounts[0] || defaultState.address,
  assets: defaultState.assets,
  assetsPending: defaultState.assetsPending,
  connected: defaultState.connected,
  connectionIat: existingWCJSState.connectionIat || defaultState.connectionIat,
  connector: defaultState.connector,
  delegateHashLoading: defaultState.delegateHashLoading,
  figureConnected: existingWCJSState.account && defaultState.connected,
  newAccount: existingWCJSState.newAccount || defaultState.newAccount,
  peer: defaultState.peer,
  publicKey: existingWCState?.accounts && existingWCState.accounts[1] || defaultState.publicKey,
  QRCode: defaultState.QRCode,
  sendHashLoading: defaultState.sendHashLoading,
  showQRCodeModal: defaultState.showQRCodeModal,
  signedJWT: defaultState.signedJWT,
  signJWTLoading: defaultState.signJWTLoading,
  signMessageLoading: defaultState.signMessageLoading,
};

export class WalletConnectService {
  #eventEmitter = new events.EventEmitter();

  #setWalletConnectState = undefined;
  
  #network = 'mainnet';

  state = { ...initialState };
  
  constructor(network) {
    if (network) {
      this.#network = network;
    }
    // Check if we have an address and public key, if so, auto-reconnect to session
    if (this.state.address && this.state.publicKey) {
      // Reconnect the users walletconnect session
      this.connect();
      // Compare the "connection initialized at" time to current time
      const now = Math.floor(Date.now() / 1000);
      if (this.state.connectionIat && (now - this.state.connectionIat) > CONNECTION_TIMEOUT[this.#network]) {
        this.disconnect();
      }
    }
  }

  // *** Event Listener *** (https://nodejs.org/api/events.html)
  // Instead of having to use walletConnectService.eventEmitter.addListener()
  // We want to be able to use walletConnectService.addListener() to pass the arguments directly into eventEmitter
  #broadcastEvent = (eventName, params) => {
    this.#eventEmitter.emit(eventName, params);
  }
  
  addListener(eventName, callback) {
    this.#eventEmitter.addListener(eventName, callback);
  };

  on(eventName, callback) {
    this.#eventEmitter.addListener(eventName, callback);
  };

  removeListener(eventName, callback) {
    this.#eventEmitter.removeListener(eventName, callback);
  };

  removeAllListeners(eventName) {
    this.#eventEmitter.removeAllListeners(eventName);
  }

  setNetwork(network) {
    this.#network = network;
  };

  updateState() {
    if (this.#setWalletConnectState) {
      this.#setWalletConnectState({
        ...this.state,
      });
    }
  };

  setStateUpdater(setWalletConnectState) {
    this.#setWalletConnectState = setWalletConnectState;
  };

  resetState = () => {
    this.state = { ...defaultState };
    this.updateState();
  };

  #updateLocalStorage = (updatedState) => {
    // Special values to look for
    const { connectionIat, account, newAccount } = updatedState;
    // If the value was changed, add it to the localStorage updates
    const storageUpdates = {
      ...(connectionIat !== undefined && {connectionIat}),
      ...(account !== undefined && {account}),
      ...(newAccount !== undefined && {newAccount}),
    };
    // If we have updated 1 or more special values, update localStorage
    if (Object.keys(storageUpdates).length) {
      addToLocalStorage('walletconnect-js', storageUpdates);
    }
  };

  setState = (updatedState) => {
    // Loop through each to update
    Object.keys(updatedState).forEach((key) => {
      this.state[key] = updatedState[key];
    }, this);
    this.updateState();
    // Write state changes into localStorage as needed
    this.#updateLocalStorage(updatedState);
  };
  
  connect = () => {
    connectMethod(this.setState, this.resetState, this.#broadcastEvent);   
  };

  disconnect = () => {
    if (this?.state?.connector) {
      this.state.connector.killSession();
    }
  };

  signMessage = async (customMessage) => {
    // Loading while we wait for mobile to respond
    this.setState({ signMessageLoading: true });
    // Get result back from mobile actions and wc
    const result = await signMessageMethod(this.state, customMessage);
    // No longer loading
    this.setState({ signMessageLoading: false });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.SIGNATURE_FAILED : WINDOW_MESSAGES.SIGNATURE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
  };

  sendHash = async (txData) => {
    // Loading while we wait for mobile to respond
    this.setState({ sendHashLoading: true });
    const result = await sendHashMethod(this.state, txData);
    // No longer loading
    this.setState({ sendHashLoading: false });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.TRANSACTION_FAILED : WINDOW_MESSAGES.TRANSACTION_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
  };

  signJWT = async () => {
    // Loading while we wait for mobile to respond
    this.setState({ signJWTLoading: true });
    const result = await signJWTMethod(this.state);
    // No longer loading
    this.setState({ signJWTLoading: false });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.SIGN_JWT_FAILED : WINDOW_MESSAGES.SIGN_JWT_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
  };

  delegateHash = async (txData) => {
    // Loading while we wait for mobile to respond
    this.setState({ delegateHashLoading: true });
    const result = await delegateHashMethod(this.state, txData);
    // No longer loading
    this.setState({ delegateHashLoading: false });
    // Broadcast result of method
    const windowMessage = result.error ? WINDOW_MESSAGES.DELEGATE_HASH_FAILED : WINDOW_MESSAGES.DELEGATE_HASH_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
  };

  showQRCode = (value) => {
    this.setState({ showQRCodeModal: value })
  };
};
