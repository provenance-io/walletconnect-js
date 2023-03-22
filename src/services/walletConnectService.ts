import { Buffer } from 'buffer';
import events from 'events';
import type {
  BroadcastEventName,
  BroadcastEventData,
  ConnectMethod,
  SendMessageMethod,
  ModalData,
  WalletConnectClientType,
  WalletConnectServiceStatus,
  WalletId,
  WCJSLocalState,
  WCJSLocalStateKeys,
  WCLocalState,
  WCLocalStateKeys,
  WCSSetFullState,
  WCSSetState,
  WCSState,
} from '../types';
import {
  CONNECTION_TIMEOUT,
  WALLET_APP_EVENTS,
  WALLETCONNECT_BRIDGE_URL,
  WINDOW_MESSAGES,
  LOCAL_STORAGE_NAMES,
} from '../consts';
import {
  connect as connectMethod,
  sendMessage as sendMessageMethod,
  sendWalletAction as sendWalletActionMethod,
  signJWT as signJWTMethod,
  signHexMessage as signHexMessageMethod,
} from './methods';
import {
  addToLocalStorage,
  clearLocalStorage,
  getAccountInfo,
  getLocalStorageValues,
  isMobile,
  sendWalletEvent,
} from '../utils';

// If we don't have a value for Buffer (node core module) create it/polyfill it
if (window.Buffer === undefined) window.Buffer = Buffer;

const defaultState: WCSState = {
  address: '',
  bridge: WALLETCONNECT_BRIDGE_URL,
  status: 'disconnected',
  connectionEST: null,
  connectionEXP: null,
  connectionTimeout: CONNECTION_TIMEOUT,
  modal: {
    showModal: false,
    isMobile: isMobile(),
    dynamicUrl: '',
    QRCodeImg: '',
    QRCodeUrl: '',
  },
  peer: null,
  pendingMethod: '',
  publicKey: '',
  representedGroupPolicy: null,
  signedJWT: '',
  walletAppId: undefined,
  walletInfo: {},
};

export class WalletConnectService {
  #connectionTimer = 0;

  #connector?: WalletConnectClientType;

  #eventEmitter = new events.EventEmitter();

  #setWalletConnectContext: WCSSetFullState | undefined = undefined;

  state: WCSState = defaultState;

  constructor() {
    this.#buildInitialState();
  }

  #getLocalStorageState = (currentState: WCSState): WCSState => {
    // If this is the first load, we need to default values to the current state, not the default state since default state has already been initialized

    // Pull 'walletconnect' and 'walletconnect-js' localStorage values to build the state if they exists
    const { existingWCJSState, existingWCState } = getLocalStorageValues();
    // Pull out account info from the "accounts" array found in 'walletconnect'
    const {
      address: localStorageAddress,
      publicKey: localStoragePublicKey,
      jwt: localStorageJWT,
      walletInfo: localStorageWalletInfo,
      representedGroupPolicy: localStorageRepresentedGroupPolicy,
    } = getAccountInfo(existingWCState.accounts);
    // Calculate the current connection status based on localStorage and current values
    const getNewStatus = (): WalletConnectServiceStatus => {
      const currentStateStatus = currentState.status;
      // If we're already connected and the storage connector is also connected, don't change status
      if (existingWCState.connected && currentStateStatus === 'connected')
        return 'connected';
      // If we're not connected and the storage connector is connected, set status to pending (connection might exist)
      if (existingWCState.connected && currentStateStatus === 'disconnected')
        return 'pending';
      // If we're not connected and the storage connector is not connected, keep status as disconnected
      if (!existingWCState.connected && currentStateStatus === 'disconnected')
        return 'disconnected';
      // If localStorage doesn't exist/is not connected but the service state was still connected, return back disconnected (localStorage much exist to be connected)
      if (!existingWCState.connected && currentStateStatus === 'connected')
        return 'disconnected';
      // Default return back the current states status or default status if nothing is set/exists yet
      return currentStateStatus;
    };
    return {
      address: localStorageAddress || currentState.address,
      bridge: existingWCState.bridge || currentState.bridge,
      connectionEXP: existingWCJSState.connectionEXP || currentState.connectionEXP,
      connectionEST: existingWCJSState.connectionEST || currentState.connectionEST,
      connectionTimeout:
        existingWCJSState.connectionTimeout || currentState.connectionTimeout,
      modal: currentState.modal,
      peer: currentState.peer,
      pendingMethod: currentState.pendingMethod,
      publicKey: localStoragePublicKey || currentState.publicKey,
      // Note: we are pulling from wcjs storage first incase the user generated a newer JWT since connecting
      signedJWT:
        existingWCJSState.signedJWT || localStorageJWT || currentState.signedJWT,
      status: getNewStatus(),
      walletAppId: existingWCJSState.walletAppId || currentState.walletAppId,
      walletInfo: localStorageWalletInfo || currentState.walletInfo,
      representedGroupPolicy:
        localStorageRepresentedGroupPolicy || currentState.representedGroupPolicy,
    };
  };

  // Populate the initial state from init call.  Does not trigger "setState" function
  #buildInitialState = () => {
    // Get the latest state using defaultState values (initial = true)
    const newState = this.#getLocalStorageState(defaultState);
    this.state = newState;
    // If the status is "pending" attempt to reconnect
    if (newState.status === 'pending') {
      // ConnectionTimeout is saved in ms, the connect function takes it as seconds, so we need to convert
      const duration = newState.connectionTimeout
        ? newState.connectionTimeout / 1000
        : undefined;
      this.connect({ duration, bridge: newState.bridge });
    }
  };

  // Populate the state when localStorage updated.  Trigger "setState" function
  // Note: We want to skip updating localStorage with the setState
  #updateState = () => {
    // Get latest state based on current state values
    const currentState = this.#getLocalStorageState(defaultState);
    this.#setState(currentState, false);
    // If the status is "pending" attempt to reconnect
    if (currentState.status === 'pending') {
      // ConnectionTimeout is saved in ms, the connect function takes it as seconds, so we need to convert
      const duration = currentState.connectionTimeout
        ? currentState.connectionTimeout / 1000
        : undefined;
      this.connect({ duration, bridge: currentState.bridge });
    }
  };

  // *** Event Listener *** (https://nodejs.org/api/events.html)
  // Instead of having to use walletConnectService.eventEmitter.addListener()
  // We want to be able to use walletConnectService.addListener() to pass the arguments directly into eventEmitter
  #broadcastEvent = (
    eventName: BroadcastEventName,
    eventData: BroadcastEventData
  ) => {
    console.log('#broadcastEvent: ', { eventName, eventData });
    this.#eventEmitter.emit(eventName, eventData);
  };

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

  // Reset walletConnectService state back to the original default state
  #resetState = () => {
    this.state = { ...defaultState };
    this.#updateContext();
    clearLocalStorage('walletconnect-js');
  };

  // Change the class state
  #setState: WCSSetState = (updatedState, updateLocalStorage = true) => {
    // If the updatedState passes a connector value we want to use it but save it separatly from the public state
    const { connector, ...filteredUpdatedState } = updatedState;
    let finalUpdatedState = { ...filteredUpdatedState };
    // If we get a new "connector" passed in, pull various data keys out
    if (connector) {
      // Update private connector value
      this.#connector = connector;
      // Pull out/surface connector data for state
      const { bridge, peerMeta, accounts, connected } = connector;
      const status = connected ? 'connected' : 'disconnected';
      const { address, jwt, publicKey, representedGroupPolicy, walletInfo } =
        getAccountInfo(accounts);
      finalUpdatedState = {
        ...updatedState,
        address,
        bridge,
        status,
        // We always want to use the jwt in the state over the connector since newer jwts won't show up in the connector
        signedJWT: this.state.signedJWT || jwt,
        publicKey,
        representedGroupPolicy,
        walletInfo,
        peer: peerMeta,
      };
    }
    // Loop through each to update
    this.state = { ...this.state, ...finalUpdatedState };
    this.#updateContext();
    // Write state changes into localStorage as needed
    if (updateLocalStorage) this.#updateLocalStorage(finalUpdatedState);
  };

  // Update the class object to reflect the latest state changes
  #updateContext = (): void => {
    if (this.#setWalletConnectContext) {
      this.#setWalletConnectContext({
        ...this.state,
      });
    }
  };

  // Create listeners used with eventEmitter/broadcast results
  addListener(
    eventName: BroadcastEventName,
    callback: (results: BroadcastEventData) => void
  ) {
    this.#eventEmitter.addListener(eventName, callback);
  }

  // Remove listener w/specific eventName used with eventEmitter/broadcast results
  removeListener(
    targetEvent: BroadcastEventName | 'all',
    callback?: (results: BroadcastEventData) => void
  ) {
    if (targetEvent === 'all') {
      this.#eventEmitter.eventNames().forEach((eventName) => {
        this.#eventEmitter.removeAllListeners(eventName);
      });
    } else if (callback) {
      // Callback must be provided to remove specific event action
      this.#eventEmitter.removeListener(targetEvent, callback);
    }
  }

  // One or more values within localStorage have changed, see if we care about any of the values and update the state as needed
  handleLocalStorageChange = (storageEvent: StorageEvent) => {
    const { key: storageEventKey, newValue, oldValue } = storageEvent;
    const validStorageEventKey =
      storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECT ||
      storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECTJS;
    if (validStorageEventKey) {
      const newValueObj = JSON.parse(newValue || '{}') as Partial<
        WCJSLocalState & WCLocalState
      >;
      const oldValueObj = JSON.parse(oldValue || '{}') as Partial<
        WCJSLocalState & WCLocalState
      >;
      // Keys to look for within 'walletconnect' storage object
      const targetWCValues: Partial<WCLocalStateKeys>[] = [
        'accounts',
        'bridge',
        'connected',
      ];

      // Keys to look for within 'walletconnect-js' storage object
      const targetWCJSValues: WCJSLocalStateKeys[] = [
        'connectionEXP',
        'connectionEST',
        'connectionTimeout',
        'signedJWT',
        'walletAppId',
      ];
      // Look for specific changed key values in the objects and return a final object with all the changes
      const findChangedValues = (
        targetValues: typeof targetWCValues | typeof targetWCJSValues
      ) => {
        const foundChangedValues = {} as Record<
          WCLocalStateKeys[number] | WCJSLocalStateKeys[number],
          unknown
        >;
        targetValues.forEach((targetKey) => {
          // Accounts array holds an object with data, but we only want to look at the address value
          // Idea here is that if the account changed we should reload the connection to get the full new data
          if (targetKey === 'accounts') {
            if (
              newValueObj?.accounts?.[0].address !==
              oldValueObj.accounts?.[0].address
            ) {
              foundChangedValues.address = newValueObj?.accounts?.[0].address;
            }
          } else if (newValueObj[targetKey] !== oldValueObj[targetKey]) {
            foundChangedValues[targetKey] = newValueObj[targetKey];
          }
        });
        return foundChangedValues;
      };
      let changedValuesWC, changedValuesWCJS;
      // Make sure the key is changing a value we care about, must be walletconnect or walletconnect-js
      if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECT)
        changedValuesWC = findChangedValues(targetWCValues);
      if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECTJS)
        changedValuesWCJS = findChangedValues(targetWCJSValues);

      const changedValues = { ...changedValuesWC, ...changedValuesWCJS };
      const totalChangedValues = Object.keys(changedValues).length;
      if (totalChangedValues) {
        this.#updateState();
      }
    }
  };

  // Create a stateUpdater, used for context to be able to auto change this class state
  setContextUpdater(updateFunction: WCSSetFullState): void {
    this.#setWalletConnectContext = updateFunction;
  }

  // Set a new walletAppId
  setWalletAppId = (id: WalletId) => {
    this.#setState({ walletAppId: id });
  };

  // Update the modal values
  updateModal = (newModalData: Partial<ModalData> & { walletAppId?: WalletId }) => {
    const newModal = { ...this.state.modal, ...newModalData };
    let status = this.state.status;
    // If we're closing the modal and #connector isn't connected, update the status from "pending" to "disconnected".  Note: walletAppId will prevent a popup and is different from "closing", so check for it.
    if (
      !newModalData.showModal &&
      status === 'pending' &&
      !this.#connector?.connected &&
      !newModalData.walletAppId
    ) {
      status = 'disconnected';
    }
    this.#setState({
      modal: newModal,
      status,
      ...(newModalData.walletAppId && { walletAppId: newModalData.walletAppId }),
    });
  };

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
    this.#setState({ connectionTimeout: newConnectionTimeout, connectionEXP });
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

  /**
   * @param bridge - (optional) URL string of bridge to connect into
   * @param duration - (optional) Time before connection is timed out (seconds)
   * @param individualAddress - (optional) Individual address to establish connection with, note, if requested, it must exist
   * @param groupAddress - (optional) Group address to establish connection with, note, if requested, it must exist
   * @param prohibitGroups - (optional) Does this dApp ban group accounts connecting to it
   * @param jwtExpiration - (optional) Time from now in seconds to expire new JWT returned
   * @param walletAppId - (optional) Open a specific wallet directly (bypassing the QRCode modal)
   */
  connect = ({
    individualAddress,
    groupAddress,
    bridge,
    duration,
    jwtExpiration,
    prohibitGroups,
    walletAppId,
  }: ConnectMethod = {}) => {
    // Only create a new connector when we're not already connected
    if (this.state.status !== 'connected') {
      // Update the duration of this connection
      this.#setState({
        connectionTimeout: duration ? duration * 1000 : this.state.connectionTimeout,
        status: 'pending',
      });
      const newConnector = connectMethod({
        bridge: bridge || this.state.bridge,
        broadcast: this.#broadcastEvent,
        getState: this.#getState,
        jwtExpiration,
        prohibitGroups,
        requiredGroupAddress: groupAddress,
        requiredIndividualAddress: individualAddress,
        resetState: this.#resetState,
        setState: this.#setState,
        startConnectionTimer: this.#startConnectionTimer,
        state: this.state,
        updateModal: this.updateModal,
        walletAppId,
      });

      this.#connector = newConnector;
    }
  };

  /**
   *
   * @param message (optional) Custom disconnect message to send back to dApp
   * */
  disconnect = async (message?: string) => {
    // Clear out the existing connection timer
    this.#clearConnectionTimer();
    if (this.#connector) await this.#connector.killSession({ message });
    return message;
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
  }: SendMessageMethod) => {
    // Loading while we wait for mobile to respond
    this.#setState({ pendingMethod: 'sendMessage' });
    const result = await sendMessageMethod({
      address: this.state.address,
      connector: this.#connector,
      walletAppId: this.state.walletAppId,
      data: {
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
      },
    });
    // No longer loading
    this.#setState({ pendingMethod: '' });
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
   * @param groupPolicyAddress the Group Policy to switch the wallet to - if null, the wallet
   *        will "unswitch" the group
   * @param description (optional) provide description to display in the wallet when
   *        switching to group policy address
   */
  switchToGroup = async (groupPolicyAddress?: string, description?: string) => {
    // Loading while we wait for mobile to respond
    this.#setState({ pendingMethod: 'switchToGroup' });
    const result = await sendWalletActionMethod({
      connector: this.#connector,
      walletAppId: this.state.walletAppId,
      data: {
        action: 'switchToGroup',
        payload: groupPolicyAddress ? { address: groupPolicyAddress } : undefined,
        description,
        method: 'wallet_action',
      },
    });
    // No longer loading
    this.#setState({ pendingMethod: '' });
    // Broadcast result of method
    const windowMessage = result.error
      ? WINDOW_MESSAGES.SWITCH_TO_GROUP_FAILED
      : WINDOW_MESSAGES.SWITCH_TO_GROUP_COMPLETE;
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
    this.#setState({ pendingMethod: 'signJWT' });
    const result = await signJWTMethod({
      address: this.state.address,
      connector: this.#connector,
      publicKey: this.state.publicKey,
      setState: this.#setState,
      walletAppId: this.state.walletAppId,
      expires,
    });
    // No longer loading
    this.#setState({ pendingMethod: '' });
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
  signHexMessage = async (hexMessage: string) => {
    // Loading while we wait for mobile to respond
    this.#setState({ pendingMethod: 'signHexMessage' });
    // Get result back from mobile actions and wc
    const result = await signHexMessageMethod({
      address: this.state.address,
      connector: this.#connector,
      hexMessage,
      publicKey: this.state.publicKey,
      walletAppId: this.state.walletAppId,
    });
    // No longer loading
    this.#setState({ pendingMethod: '' });
    // Broadcast result of method
    const windowMessage = result.error
      ? WINDOW_MESSAGES.SIGN_HEX_MESSAGE_FAILED
      : WINDOW_MESSAGES.SIGN_HEX_MESSAGE_COMPLETE;
    this.#broadcastEvent(windowMessage, result);
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();

    return result;
  };
}
