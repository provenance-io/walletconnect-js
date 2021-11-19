import events from 'events';
import { WINDOW_MESSAGES } from '../consts';
import {
  connect as connectMethod,
  signMessage as signMessageMethod,
  sendHash as sendHashMethod,
  signJWT as signJWTMethod,
  delegateHash as delegateHashMethod,
} from './methods';

const initialState = {
  connected: false,
  connector: null,
  address: '',
  publicKey: '',
  peer: {},
  signedJWT: '',
  signJWTLoading: false,
  signMessageLoading: false,
  sendHashLoading: false,
  delegateHashLoading: false,
  assetsPending: false,
  assets: [],
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
    const result = await signMessageMethod(this.state, customMessage, this.#network);
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
    const result = await signJWTMethod(this.state, this.#network);
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
};
