import events from 'events';
import { WINDOW_MESSAGES } from '../consts';
import {
  connect as connectMethod,
  signMessage as signMessageMethod,
  sendHash as sendHashMethod,
  signJWT as signJWTMethod,
  delegateHash as delegateHashMethod,
} from './methods';
import { getFromLocalStorage } from '../utils';

// Check for existing values from sessionStorage or from URL params
const existingState = getFromLocalStorage('walletconnect');

const defaultState = {
  account: '',
  newAccount: false,
  address: '',
  assets: [],
  assetsPending: false,
  connected: false,
  connector: null,
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
  account: existingState.account || defaultState.account,
  address: existingState?.accounts && existingState.accounts[0] || defaultState.address,
  assets: defaultState.assets,
  assetsPending: defaultState.assetsPending,
  connected: defaultState.connected,
  connector: defaultState.connector,
  delegateHashLoading: defaultState.delegateHashLoading,
  newAccount: existingState.newAccount || defaultState.newAccount,
  peer: defaultState.peer,
  publicKey: existingState?.accounts && existingState.accounts[1] || defaultState.publicKey,
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
      this.connect();
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
    this.state = { ...initialState };
    this.updateState();
  };

  setState = (updatedState) => {
    // Loop through each to update
    Object.keys(updatedState).forEach((key) => {
      this.state[key] = updatedState[key];
    }, this);
    this.updateState();
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
