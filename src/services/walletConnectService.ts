import WalletConnectClient from '@walletconnect/client';
import { Buffer } from 'buffer';
import {
  CUSTOM_EVENT_EXTENSION,
  // BROWSER_WALLETS,
  DEFAULT_JWT_DURATION,
  LOCAL_STORAGE_NAMES,
  WALLETCONNECT_BRIDGE_URL,
  WALLET_LIST,
  WCS_BACKUP_TIMER_INTERVAL,
  WCS_DEFAULT_STATE,
} from '../consts';
import type {
  BrowserWallet,
  BrowserWalletEventActionResponses,
  ConnectMethodService,
  ConnectMethodServiceFunctionResults,
  PartialState,
  ServiceSendTx,
  // SendMessageMethod,
  WCLocalState,
  WCSState,
  WalletId,
} from '../types';
import {
  addToLocalStorage,
  clearLocalStorage,
  getLocalStorageValues,
  walletConnectAccountInfo,
} from '../utils';
// browser methods
import {
  connect as browserConnect,
  disconnect as browserDisconnect,
  resumeConnection as browserResumeConnection,
  sendTx as browserSendTx,
  sign as browserSign,
} from './methods/browser';

// If we don't have a value for Buffer (node core module) create it/polyfill it
if (window.Buffer === undefined) window.Buffer = Buffer;

export class WalletConnectService {
  #connectionTimer = 0; // Timer tracking when the currenct wcjs connection should expire

  #backupConnectionTimer = 0; // Interval timer running every x seconds checking connection status

  #connector?: WalletConnectClient; // walletconnect connector object

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
            console.log(
              'wcjs | walletConnectService.ts | #setState | connection | newNestedState, existingNestedState: ',
              newNestedState,
              existingNestedState
            );
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
      // TODO: Needs work here
      // Somehow need to not carelessly update this localStorage. Only if keys of value are changed and need to be saved
      // Example: Status of "pending" should never be saved.
      // Default store values should also never be saved (they will be pulled on load without needing to live in localStorage)
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
  #backupTimer = (status: 'start' | 'clear') => {
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
  };

  // Keep the WalletConnect connector saved, but inaccessable/out of the class state
  #setConnector(connector?: WalletConnectClient) {
    this.#connector = connector;
  }

  #checkExistingConnectionWC = (existingWCState?: WalletConnectClient) => {
    console.log(
      'wcjs | #checkExistingConnectionWC | existingWCState: ',
      existingWCState
    );
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
  };

  #checkExistingConnectionBrowser = async (
    existingConnection?: WCSState['connection']
  ) => {
    console.log(
      'wcjs | #checkExistingConnectionBrowser | existingConnection: ',
      existingConnection
    );
    if (existingConnection) {
      const { status, exp, walletId } = existingConnection;
      // Are we previously connected, not expired, & have a valid wallet?
      const isConnected = status && status === 'connected';
      const isNotExpired = exp && exp > Date.now();
      // const isBrowserWallet = walletId && BROWSER_WALLETS.includes(walletId);
      if (walletId) {
        const wallet = WALLET_LIST.find(({ id }) => id === walletId);
        const isBrowserWallet = wallet && wallet.type === 'browser';
        // Check if criteria for resuming a browser connection is met
        if (isConnected && isNotExpired && isBrowserWallet) {
          console.log(
            'wcjs | #checkExistingConnectionBrowser | we might be connected...'
          );
          // Send a connection request to confirm that the connection still exists
          const results = await browserResumeConnection(wallet as BrowserWallet);
          console.log(
            'wcjs | #checkExistingConnectionBrowser | are we connected results: ',
            results
          );
          // TODO: These should be a separate method in wcjs service to reuse for other method results (they should all return a similar shape)
          if (results.resetState) this.#setState('reset');
          if (results.state) {
            this.#listenForBrowserWalletDisconnect(walletId);
            this.#setState(results.state);
            // Start the connection timer
            this.#startConnectionTimer();
          }
        }
      }
    }
  };

  constructor() {
    // Pull 'walletconnect' and 'walletconnect-js' localStorage values to see if we might already be connected
    const { existingWCJSState, existingWCState } = getLocalStorageValues();
    // If we have an existing wcjs state, update this service state and check for existing connection
    if (existingWCJSState) {
      // Note: We don't want to pull the "status" or "pendingMethod" (might be a better way to do this)
      const cleanExistingWCJSState = {
        ...existingWCJSState,
        connection: {
          ...existingWCJSState.connection,
          status: WCS_DEFAULT_STATE.connection.status,
          pendingMethod: WCS_DEFAULT_STATE.connection.pendingMethod,
        },
      };
      this.#setState(cleanExistingWCJSState, false);
      this.#checkExistingConnectionBrowser(existingWCJSState.connection);
    }
    // Check for existing walletconnect data
    this.#checkExistingConnectionWC(existingWCState);

    // Setup a listener for localStorage changes
    window.addEventListener('storage', this.#handleLocalStorageChange);
    // If we're connected, start the backup timer
    if (this.state.connection.status === 'connected') this.#backupTimer('start');
  }

  // Allow this class to notify/update the context about state changes
  setContextUpdater(updateFunction: (state: WCSState) => void): void {
    this.#updateContext = updateFunction;
    // Call the update context function as soon as it's created (to remain up to date)
    this.#updateContext(this.state);
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

  #listenForBrowserWalletDisconnect(walletId: WalletId) {
    // Since we are now connected, create an event listener to allow the wallet to say when it 'disconnects' from the dApp
    // (Normally it's wcjs disconnecting, but users can disconnect manually from within the wallet) - This exists in resume & connect methods for browser wallets
    // Only listen once

    // Only do this for browser wallets
    const wallet = WALLET_LIST.find(({ id }) => id === walletId);
    if (wallet && wallet.type === 'browser') {
      addEventListener(
        CUSTOM_EVENT_EXTENSION,
        (message) => {
          // TODO: Get sender types
          const {
            sender,
            event,
          }: {
            sender: string;
            event: BrowserWalletEventActionResponses['disconnect'];
          } = (message as CustomEvent).detail;
          // Only listen to messages sent by the content-script
          if (sender === 'content-script') {
            console.log(
              'wcjs | disconnectEvent | message, result: ',
              message,
              event
            );
            this.disconnect(event.disconnect, true);
          }
        },
        { once: true }
      );
    }
  }

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
        jwt,
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
    // TODO: Is it an issue that same origin, all pages will get "pending" status when one is connecting? For now, leave as is and find out
    const newValueObj = newValue
      ? (JSON.parse(newValue || '{}') as PartialState<WCSState>)
      : 'reset';
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
  #handleLocalStorageChange = (storageEvent: StorageEvent) => {
    const { key: storageEventKey, newValue } = storageEvent;
    // Info: Another tab triggered a disconnect, or "switch account", connectionTimeout reset, etc
    if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECTJS)
      this.#localStorageChangeBrowserWallet(newValue);
    // WalletConnect localStorage values changed
    else if (storageEventKey === LOCAL_STORAGE_NAMES.WALLETCONNECT)
      this.#localStorageChangeWalletConnect(newValue);
  };

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
   * @param bridge - (optional) URL string of bridge to connect into (walletconnect only)
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
  }: ConnectMethodService) => {
    console.log('wcjs | walletConnectService.ts | connect()');
    // Pull wallet based on id entered
    const wallet = WALLET_LIST.find(({ id }) => id === walletId);
    // ----------------
    // Check for errors
    // ----------------
    // If we're already connected, ignore this event
    if (this.state.connection.status === 'connected')
      return { error: { message: 'Already connected', code: 0 } };
    // If we can't find a wallet based on the id, kick back an error
    if (!wallet) return { error: { message: 'Invalid wallet ID', code: 0 } };
    // --------------------------------------------
    // No errors, send message based on wallet type
    // --------------------------------------------
    this.#setState({ connection: { status: 'pending' } });
    // Object to be passed into each type of connectMethod (defaults filled in)
    const requestParams = {
      individualAddress,
      groupAddress,
      // Duration/jwtExpiration should be in ms, but is passed into connect as s
      connectionDuration: connectionDuration
        ? connectionDuration * 1000
        : this.state.connection.connectionDuration,
      jwtDuration: jwtDuration ? jwtDuration * 1000 : DEFAULT_JWT_DURATION,
      prohibitGroups,
      wallet,
    };
    let results: ConnectMethodServiceFunctionResults = {};
    // TODO: Refactor walletconnect connect method
    // if (wallet.type === 'walletconnect')
    //   results = await wcConnect({
    //     individualAddress,
    //     groupAddress,
    //     bridge,
    //     // Duration/jwtExpiration should be in ms, but is passed into connect as s
    //     connectionDuration: connectionDuration
    //       ? connectionDuration * 1000
    //       : this.state.connection.connectionDuration,
    //     jwtDuration: jwtDuration ? jwtDuration * 1000 : DEFAULT_JWT_DURATION,
    //     prohibitGroups,
    //     walletId,
    //   });
    console.log('wcjs | walletConnectService.ts | browserConnect pending');
    if (wallet.type === 'browser')
      results = await browserConnect({
        ...requestParams,
        wallet: requestParams.wallet as BrowserWallet,
      });
    console.log(
      'wcjs | walletConnectService.ts | browserConnect results: ',
      results
    );
    // Based on the results perform service actions
    // if (results.error) return { error: results.error };
    // No error means we've connected, add the disconnect event if passed in
    // else {
    if (onDisconnect) this.#setState({ connection: { onDisconnect } });
    // TODO: These should be a separate method in wcjs service to reuse for other method results (they should all return a similar shape)
    if (results.connector) this.#connector = results.connector;
    if (results.resetState) this.#setState('reset');
    if (results.state) {
      this.#listenForBrowserWalletDisconnect(walletId);
      this.#setState(results.state);
      // Start the connection timer
      this.#startConnectionTimer();
    }
    // TODO: What should we return to the user? Right now returning everything...
    // Certain values do not/should not be returned. Manually filter them for now, later can create const or helper...
    const { resetState, ...wantedResults } = results;
    return wantedResults;
    // }
  };

  /**
   *
   * @param message (optional) Custom disconnect message to send back to dApp
   * */
  disconnect = async (message = 'Disconnected', triggeredByWallet = false) => {
    // Clear connection timers
    this.#backupTimer('clear');
    this.#clearConnectionTimer();
    // Run disconnect callback function if provided/exists
    if (this.state.connection.onDisconnect)
      this.state.connection.onDisconnect(message);
    // If this disconnect was triggered by the wallet, there is no reason to let the wallet know we've been disconnected
    if (!triggeredByWallet) {
      // If walletconnect connected, kill the session
      if (this.#connector && this.#connector.connected)
        await this.#connector.killSession({ message });
      // Check if we need to send a browser wallet message about the disconnect
      if (this.state.connection.walletId) {
        const wallet = WALLET_LIST.find(
          ({ id }) => id === this.state.connection.walletId
        );
        if (wallet && wallet.type === 'browser')
          browserDisconnect(message, wallet as BrowserWallet);
      }
    }
    // Move the wcjs state back to default values
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
   * @param tx (required) Raw Base64 encoded msgAny string
   * @param method (optional) What method is used to send this message
   * @param nonCriticalExtensionOptions (optional) Tx body nonCriticalExtensionOptions
   * @param timeoutHeight (optional) Tx body timeoutHeight
   */
  sendTx = async (data: ServiceSendTx) => {
    console.log('wcjs | walletConnectService.ts | sendTx()');
    const { status, walletId } = this.state.connection;
    const { address } = this.state.wallet;
    const isConnected = status === 'connected';
    const wallet = WALLET_LIST.find(({ id }) => id === walletId);
    const validWallet = wallet && address;
    let results;
    // Must be connected and have a valid wallet
    if (isConnected && validWallet) {
      this.#setState({ connection: { pendingMethod: 'sendTx' } });
      if (wallet.type === 'browser') {
        results = await browserSendTx({
          address,
          wallet: wallet as BrowserWallet,
          ...data,
        });
      }
      // Wait to get the result back
      // const result = await signMessageMethod({
      //   address: this.state.wallet.address || '',
      //   connector: this.#connector,
      //   customId: options?.customId,
      //   message,
      //   isHex: options?.isHex,
      //   description: options?.description,
      //   publicKey: this.state.wallet.publicKey || '',
      //   walletId: this.state.connection.walletId,
      // });
      console.log('walletConnectService | signMessage result: ', results);
      // No longer loading
      this.#setState({ connection: { pendingMethod: '' } });
      // Refresh auto-disconnect timer
      this.resetConnectionTimeout();
    } else {
      results = {
        error: {
          message: isConnected ? 'Invalid wallet' : 'Not connected',
          code: 0,
        },
      };
    }
    return results;
  };

  /**
   *
   * @param groupPolicyAddress the Group Policy to switch the wallet to - if null, the wallet
   *        will "unswitch" the group
   * @param description (optional) provide description to display in the wallet when
   *        switching to group policy address
   */
  // switchToGroup = async (groupPolicyAddress?: string, description?: string) => {
  //   // Only run this if we have a wallet id
  //   if (this.state.connection.walletId) {
  //     // Loading while we wait for response
  //     this.#setState({ connection: { pendingMethod: 'switchToGroup' } });
  //     const result = await sendWalletActionMethod({
  //       connector: this.#connector,
  //       walletId: this.state.connection.walletId,
  //       data: {
  //         action: 'switchToGroup',
  //         payload: groupPolicyAddress ? { address: groupPolicyAddress } : undefined,
  //         description,
  //         method: 'wallet_action',
  //       },
  //     });
  //     // No longer loading
  //     this.#setState({ connection: { pendingMethod: '' } });
  //     // Refresh auto-disconnect timer
  //     this.resetConnectionTimeout();

  //     return result;
  //   }
  //   return { error: 'missing wallet id' };
  // };

  /**
   *
   * @param expires Time from now in seconds to expire new JWT
   * @param description (optional) Additional information for wallet to display
   */
  // signJWT = async (
  //   expires: number,
  //   options?: { customId?: string; description?: string }
  // ) => {
  //   // Only run this if we have a wallet id
  //   if (this.state.connection.walletId) {
  //     // Loading while we wait for response
  //     this.#setState({ connection: { pendingMethod: 'signJWT' } });
  //     const result = await signJWTMethod({
  //       address: this.state.wallet.address || '',
  //       connector: this.#connector,
  //       customId: options?.customId,
  //       expires,
  //       publicKey: this.state.wallet.publicKey || '',
  //       walletId: this.state.connection.walletId,
  //     });
  //     // No longer loading
  //     this.#setState({ connection: { pendingMethod: '' } });
  //     // Refresh auto-disconnect timer
  //     this.resetConnectionTimeout();
  //     return result;
  //   }
  //   return { error: 'missing wallet id' };
  // };

  /**
   *
   * @param customMessage Message you want the wallet to sign
   * @param description (optional) Additional information for wallet to display
   */
  signMessage = async (
    message: string,
    options?: {
      customId?: string;
      isHex?: boolean;
      description?: string;
    }
  ) => {
    console.log('wcjs | walletConnectService.ts | signMessage()');
    const { status, walletId } = this.state.connection;
    const { address, publicKey } = this.state.wallet;
    const isConnected = status === 'connected';
    const wallet = WALLET_LIST.find(({ id }) => id === walletId);
    const validWallet = wallet && address && publicKey;
    let results;
    // Must be connected and have a valid wallet
    if (isConnected && validWallet) {
      this.#setState({ connection: { pendingMethod: 'sign' } });
      if (wallet.type === 'browser') {
        results = await browserSign({
          address,
          message,
          publicKey,
          wallet: wallet as BrowserWallet,
          customId: options?.customId,
          description: options?.description,
          isHex: options?.isHex,
        });
      }
      // Wait to get the result back
      // const result = await signMessageMethod({
      //   address: this.state.wallet.address || '',
      //   connector: this.#connector,
      //   customId: options?.customId,
      //   message,
      //   isHex: options?.isHex,
      //   description: options?.description,
      //   publicKey: this.state.wallet.publicKey || '',
      //   walletId: this.state.connection.walletId,
      // });
      console.log('walletConnectService | signMessage result: ', results);
      // No longer loading
      this.#setState({ connection: { pendingMethod: '' } });
      // Refresh auto-disconnect timer
      this.resetConnectionTimeout();
    } else {
      results = {
        error: {
          message: isConnected ? 'Invalid wallet' : 'Not connected',
          code: 0,
        },
      };
    }
    return results;
  };

  /**
   * @param customId string (required) string id value of pending action you want to target
   */
  // removePendingMethod = async (customId: string) => {
  //   // Only run this if we have a wallet id
  //   if (this.state.connection.walletId) {
  //     // Loading while we wait for response
  //     this.#setState({ connection: { pendingMethod: 'removePendingMethod' } });
  //     // Wait to get the result back
  //     const result = await sendWalletActionMethod({
  //       connector: this.#connector,
  //       walletId: this.state.connection.walletId,
  //       data: {
  //         action: 'removePendingMethod',
  //         payload: { customId },
  //         method: 'wallet_action',
  //       },
  //     });
  //     // No longer loading
  //     this.#setState({ connection: { pendingMethod: '' } });
  //     // Refresh auto-disconnect timer
  //     this.resetConnectionTimeout();

  //     return result;
  //   }
  //   return { error: 'missing wallet id' };
  // };
}
