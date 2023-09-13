import WalletConnectClient from '@walletconnect/client';
import { Buffer } from 'buffer';
import {
  DEFAULT_JWT_DURATION,
  LOCAL_STORAGE_NAMES,
  WALLETCONNECT_BRIDGE_URL,
  WCS_BACKUP_TIMER_INTERVAL,
  WCS_DEFAULT_STATE,
} from '../consts';
import type {
  ConnectMethod,
  PartialState,
  SendMessageMethod,
  WCLocalState,
  WCSState,
  WalletConnectClientType,
} from '../types';
import {
  addToLocalStorage,
  clearLocalStorage,
  getLocalStorageValues,
  walletConnectAccountInfo,
} from '../utils';
import {
  connect as connectMethod,
  sendMessage as sendMessageMethod,
  sendWalletAction as sendWalletActionMethod,
  signJWT as signJWTMethod,
  signMessage as signMessageMethod,
} from './methods';

// If we don't have a value for Buffer (node core module) create it/polyfill it
if (window.Buffer === undefined) window.Buffer = Buffer;

export class WalletConnectService {
  #connectionTimer = 0; // Timer tracking when the currenct wcjs connection should expire

  #backupConnectionTimer = 0; // Interval timer running every x seconds checking connection status

  #connector?: WalletConnectClientType; // walletconnect connector object

  #updateContext: ((state: WCSState) => void) | undefined = undefined; // Connect class state updates to context wrapper

  state: WCSState = WCS_DEFAULT_STATE; // Main data held and used within this class object

  // Keep all state updates tidy in a single method (prevent random setting in methods)
  #setState = (
    updatedState: PartialState<WCSState> | 'reset',
    updateLocalStorage = true
  ) => {
    // NOTE: Should we protect this function by only ever setting expected state values to expected types?
    // Reason: Users can change localStorage state and force the internal wcjs state to reflect those keys/values
    const isReset = updatedState === 'reset';
    // Either clone the default state (due to reset) or use existing state
    const newState = Object.assign({}, isReset ? WCS_DEFAULT_STATE : this.state);
    // Resets don't need to update any values
    if (!isReset) {
      // Since state is not a flat object, we need to loop through each level to add/combine data vs overwriting all of it
      // Eg: Only change the state.wallet.address (leave all other state.wallet values the same)
      const updatedStateKeys = Object.keys(updatedState) as Array<
        keyof typeof updatedState
      >;
      updatedStateKeys.forEach((updateKey) => {
        const newNestedState = updatedState[updateKey];
        const existingNestedState = newState[updateKey];
        // Note: Due to TS limitations, we can't infer the key here and have to manually build out state
        switch (updateKey) {
          case 'connection':
            newState.connection = {
              ...existingNestedState,
              ...newNestedState,
            } as WCSState['connection'];
            break;
          case 'modal':
            newState.modal = {
              ...existingNestedState,
              ...newNestedState,
            } as WCSState['modal'];
            break;
          case 'wallet':
            newState.wallet = {
              ...existingNestedState,
              ...newNestedState,
            } as WCSState['wallet'];
            break;
        }
      });
    }
    // Update the state based on the newState
    this.state = newState;
    // Let the context provider know we've updated our state
    if (this.#updateContext) this.#updateContext(newState);
    // If needed, write state changes into wcjs localStorage
    if (updateLocalStorage) {
      if (isReset) clearLocalStorage('walletconnect-js');
      else addToLocalStorage('walletconnect-js', newState);
    }
  };

  #checkConnectionExpired() {
    const now = Date.now();
    if (!this.state.connection.exp || now > this.state.connection.exp) {
      // Disconnect
      this.disconnect('Connection Expired');
    }
  }

  // Interval timer which will check
  #backupTimer(status: 'start' | 'clear') {
    if (status === 'start') {
      // If we're connected and there is not already a backup timer running, start one
      if (
        this.state.connection.status === 'connected' &&
        !this.#backupConnectionTimer
      ) {
        this.#backupConnectionTimer = window.setInterval(
          () => this.#checkConnectionExpired(),
          WCS_BACKUP_TIMER_INTERVAL
        );
      }
    }
    if (status === 'clear' && this.#backupConnectionTimer) {
      window.clearInterval(this.#backupConnectionTimer);
      this.#backupConnectionTimer = 0;
    }
  }

  // Keep the WalletConnect connector saved, but inaccessable/out of the class state
  #setConnector(connector?: WalletConnectClientType) {
    this.#connector = connector;
  }

  constructor() {
    // Pull 'walletconnect' and 'walletconnect-js' localStorage values to see if we might already be connected
    const { existingWCJSState, existingWCState } = getLocalStorageValues();
    // Merge all the existing wcjs values from localStorage into state
    // TODO: We need to think this through, certain values don't need to be saved (eg: status: 'pending')
    // If we were previously "pending" we will no longer be "pending"
    if (existingWCJSState?.connection?.status === 'pending')
      existingWCJSState.connection.status = 'disconnected';
    this.#setState(existingWCJSState);
    // Are we already connected with walletconnect?
    if (
      existingWCState &&
      existingWCState.connected &&
      existingWCState.accounts.length
    ) {
      // Rebuild the connector from existing session data
      const newConnector = new WalletConnectClient({
        session: existingWCState.session,
      });
      this.#setConnector(newConnector);
    }
    // Setup a listener for localStorage changes
    window.addEventListener('storage', this.#handleLocalStorageChange);
    // If we're connected, start the backup timer
    if (this.state.connection.status === 'connected') this.#backupTimer('start');
  }

  // Allow this class to notify/update the context about state changes
  setContextUpdater(updateFunction: (state: WCSState) => void): void {
    this.#updateContext = updateFunction;
  }

  // Control auto-disconnect / timeout
  #startConnectionTimer = () => {
    // Can't start a timer if one is already running (make sure we have EXP and EST too)
    if (
      !this.#connectionTimer &&
      this.state.connection.exp &&
      this.state.connection.est
    ) {
      // Get the time until expiration (typically this.state.connectionTimeout, but might not be if session restored from refresh)
      const connectionTimeout = this.state.connection.exp - Date.now();
      // Create a new timer
      const newConnectionTimer = window.setTimeout(() => {
        // When this timer expires, kill the session
        this.disconnect('Connection Expired');
      }, connectionTimeout);
      // Save this timer (so it can be deleted on a reset)
      this.#connectionTimer = newConnectionTimer;
    }
  };

  // WalletConnect localStorage values changed
  #localStorageChangeWalletConnect(newValue: string | null) {
    // Convert string json into a workable object
    const { accounts, bridge, connected } = JSON.parse(
      newValue || '{}'
    ) as Partial<WCLocalState>;
    // Gather all new state information to update
    const newState: PartialState<WCSState> = { connection: {}, wallet: {} };
    // Did account information change? Pull it out and set it to state
    if (accounts) {
      const {
        address,
        attributes,
        jwt,
        publicKey,
        representedGroupPolicy,
        walletInfo,
      } = walletConnectAccountInfo(accounts);
      const { coin, id, name } = walletInfo || {};
      // Update wallet info
      newState.wallet = {
        address,
        signedJWT: jwt,
        publicKey,
        attributes,
        representedGroupPolicy,
        name,
        id,
        coin,
      };
    }
    // Update connection info
    newState.connection = {
      bridge,
      status: connected ? 'connected' : 'disconnected',
    };
    // Update state with new localStorage pulled values
    this.#setState(newState);
  }

  // WalletConnect-JS localStorage values changed, just merge it into state since we will store everything now
  #localStorageChangeBrowserWallet(newValue: string | null) {
    // TODO: We don't want to do this, doing this will mean if one page is loading the other page should be loading too
    // Need to pick out certain things we care about and ignore the others (state wise)
    const newValueObj = JSON.parse(newValue || '{}') as PartialState<WCSState>;
    this.#setState(newValueObj);
  }

  // Stop the current running connection timer
  #clearConnectionTimer = () => {
    if (this.#connectionTimer) {
      // Stop timer
      window.clearTimeout(this.#connectionTimer);
      // Reset timer value to 0
      this.#connectionTimer = 0;
    }
  };

  // One or more values within localStorage have changed, see if we care about any of the values and update the state as needed
  #handleLocalStorageChange(storageEvent: StorageEvent) {
    const { key: storageEventKey, newValue } = storageEvent;
    // Info: Another tab triggered a disconnect, or "switch account", connectionTimeout reset, etc
    if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECTJS)
      this.#localStorageChangeBrowserWallet(newValue);
    // WalletConnect localStorage values changed
    else if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECT)
      this.#localStorageChangeWalletConnect(newValue);
  }

  // // Update the modal values
  // updateModal = (newModalData: UpdateModalData) => {
  //   const newModal = { ...this.state.modal, ...newModalData };
  //   let status = this.state.connection.status;
  //   // If we're closing the modal and #connector isn't connected, update the status from "pending" to "disconnected".  Note: walletAppId will prevent a popup and is different from "closing", so check for it.
  //   if (
  //     !newModalData.show &&
  //     status === 'pending' &&
  //     !this.#connector?.connected &&
  //     !newModalData.walletAppId
  //   ) {
  //     status = 'disconnected';
  //   }
  //   this.#setState({
  //     modal: newModal,
  //     connection: {
  //       status,
  //       ...(newModalData.walletAppId && { walletAppId: newModalData.walletAppId }),
  //     },
  //   });
  // };

  /**
   *
   * @param connectionTimeout (optional) Seconds to bump the connection timeout by
   */
  resetConnectionTimeout = (connectionTimeoutS?: number) => {
    // Use the new (convert to ms) or existing connection timeout
    const newConnectionDuration = connectionTimeoutS
      ? connectionTimeoutS * 1000
      : this.state.connection.connectionDuration;
    // Kill the last timer (if it exists)
    if (this.#connectionTimer) {
      // Stop timer
      window.clearTimeout(this.#connectionTimer);
      // Reset timer value to 0
      this.#connectionTimer = 0;
    }
    // Build a new connectionEXP (Iat + connectionTimeout)
    const connectionEXP = newConnectionDuration + Date.now();
    // Save these new values (needed for session restore functionality/page refresh)
    this.#setState({
      connection: { connectionDuration: newConnectionDuration, exp: connectionEXP },
    });
    // Start a new timer
    this.#startConnectionTimer();
    // Send connected wallet custom event with the new connection details
    if (this.state.connection.walletId) {
      // TODO: Send event a different way than below
      // sendWalletEvent(
      //   this.state.connection.walletId,
      //   MOBILE_WALLET_APP_EVENTS.RESET_TIMEOUT,
      //   newConnectionDuration
      // );
    }
  };

  /**
   * @param bridge - (optional) URL string of bridge to connect into
   * @param connectionDuration - (optional) Time before connection is timed out (seconds)
   * @param jwtDuration - (optional) Time before signed jwt is timed out (seconds)
   * @param individualAddress - (optional) Individual address to establish connection with, note, if requested, it must exist
   * @param groupAddress - (optional) Group address to establish connection with, note, if requested, it must exist
   * @param prohibitGroups - (optional) Does this dApp ban group accounts connecting to it
   * @param jwtExpiration - (optional) Time from now in seconds to expire new JWT returned
   * @param walletId - (required) Open a specific wallet directly (bypassing the QRCode modal)
   * @param onDisconnect - (optional) Action to take if a disconnect call comes in (to handle wallet disconnecting from dApp)
   */
  connect = async ({
    individualAddress,
    groupAddress,
    bridge = WALLETCONNECT_BRIDGE_URL,
    connectionDuration,
    jwtDuration,
    prohibitGroups = false,
    walletId,
    onDisconnect,
  }: ConnectMethod) => {
    // If we're already connected, ignore this event
    if (this.state.connection.status !== 'connected') {
      this.#setState({ connection: { status: 'pending' } });
      const results = await connectMethod({
        individualAddress,
        groupAddress,
        bridge,
        // Duration/jwtExpiration should be in ms, but is passed into connect as s
        connectionDuration: connectionDuration
          ? connectionDuration * 1000
          : this.state.connection.connectionDuration,
        jwtDuration: jwtDuration ? jwtDuration * 1000 : DEFAULT_JWT_DURATION,
        prohibitGroups,
        walletId,
      });
      console.log('wcjs | walletConnectService.ts | connect results: ', results);
      // Based on the results perform service actions
      // if (results.error) return { error: results.error };
      // No error means we've connected, add the disconnect event if passed in
      // else {
      if (onDisconnect) this.#setState({ connection: { onDisconnect } });
      if (results.connector) this.#connector = results.connector;
      if (results.resetState) this.#setState('reset');
      if (results.state) {
        this.#setState(results.state);
        // Start the connection timer
        this.#startConnectionTimer();
      }
      // TODO: What should we return to the user? Right now returning everything...
      return results;
      // }
    } else {
      return { error: 'Already connected' };
    }
  };

  /**
   *
   * @param message (optional) Custom disconnect message to send back to dApp
   * */
  disconnect = async (message = 'Disconnected') => {
    // Clear connection timers
    this.#backupTimer('clear');
    this.#clearConnectionTimer();
    // Run disconnect callback function if provided/exists
    if (this.state.connection.onDisconnect)
      this.state.connection.onDisconnect(message);
    if (this.#connector && this.#connector.connected)
      await this.#connector.killSession({ message });
    this.#setState('reset');
    return message;
  };

  /**
   * @param customId (optional) custom id to track this transaction message
   * @param description (optional) Additional information for wallet to display
   * @param extensionOptions (optional) Tx body extensionOptions
   * @param feeGranter (optional) Specify a fee granter address
   * @param feePayer (optional) Specify a fee payer address
   * @param gasPrice (optional) Gas price object to use
   * @param memo (optional) Tx body memo
   * @param message (required) Raw Base64 encoded msgAny string
   * @param method (optional) What method is used to send this message
   * @param nonCriticalExtensionOptions (optional) Tx body nonCriticalExtensionOptions
   * @param timeoutHeight (optional) Tx body timeoutHeight
   */
  sendMessage = async ({
    customId,
    description,
    extensionOptions,
    feeGranter,
    feePayer,
    gasPrice,
    memo,
    message,
    method,
    nonCriticalExtensionOptions,
    timeoutHeight,
  }: SendMessageMethod) => {
    // Loading while we wait for response
    this.#setState({ connection: { pendingMethod: 'sendMessage' } });
    const result = await sendMessageMethod({
      address: this.state.wallet.address || '',
      connector: this.#connector,
      customId,
      walletId: this.state.connection.walletId,
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
    this.#setState({ connection: { pendingMethod: '' } });
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
    // Loading while we wait for response
    this.#setState({ connection: { pendingMethod: 'switchToGroup' } });
    const result = await sendWalletActionMethod({
      connector: this.#connector,
      walletId: this.state.connection.walletId,
      data: {
        action: 'switchToGroup',
        payload: groupPolicyAddress ? { address: groupPolicyAddress } : undefined,
        description,
        method: 'wallet_action',
      },
    });
    // No longer loading
    this.#setState({ connection: { pendingMethod: '' } });
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();

    return result;
  };

  /**
   *
   * @param expires Time from now in seconds to expire new JWT
   */
  signJWT = async (expires: number, options?: { customId?: string }) => {
    // Loading while we wait for response
    this.#setState({ connection: { pendingMethod: 'signJWT' } });
    const result = await signJWTMethod({
      address: this.state.wallet.address || '',
      connector: this.#connector,
      customId: options?.customId,
      expires,
      publicKey: this.state.wallet.publicKey || '',
      setState: this.#setState,
      walletId: this.state.connection.walletId,
    });
    // No longer loading
    this.#setState({ connection: { pendingMethod: '' } });
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();
    return result;
  };

  /**
   *
   * @param customMessage Message you want the wallet to sign
   */
  signMessage = async (
    message: string,
    options?: {
      customId?: string;
      isHex?: boolean;
      description?: string;
    }
  ) => {
    // Only run this if we have a wallet id
    if (this.state.connection.walletId) {
      // Loading while we wait for response
      this.#setState({ connection: { pendingMethod: 'signHexMessage' } });
      // Wait to get the result back
      const result = await signMessageMethod({
        address: this.state.wallet.address || '',
        connector: this.#connector,
        customId: options?.customId,
        message,
        isHex: options?.isHex,
        description: options?.description,
        publicKey: this.state.wallet.publicKey || '',
        walletId: this.state.connection.walletId,
      });
      console.log('walletConnectService | signHex result: ', result);
      // No longer loading
      this.#setState({ connection: { pendingMethod: '' } });
      // Refresh auto-disconnect timer
      this.resetConnectionTimeout();

      return result;
    }
    return { error: 'missing wallet id' };
  };

  /**
   * @param customId string (required) string id value of pending action you want to target
   */
  removePendingMethod = async (customId: string) => {
    // Loading while we wait for response
    this.#setState({ connection: { pendingMethod: 'removePendingMethod' } });
    // Wait to get the result back
    const result = await sendWalletActionMethod({
      connector: this.#connector,
      walletId: this.state.connection.walletId,
      data: {
        action: 'removePendingMethod',
        payload: { customId },
        method: 'wallet_action',
      },
    });
    // No longer loading
    this.#setState({ connection: { pendingMethod: '' } });
    // Refresh auto-disconnect timer
    this.resetConnectionTimeout();

    return result;
  };
}
