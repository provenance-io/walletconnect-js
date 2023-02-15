import { WALLET_LIST, WALLET_APP_EVENTS, PROVENANCE_METHODS } from '../../consts';
import { rngNum } from '../../utils';
import type {
  BroadcastResult,
  WCSSetState,
  WalletConnectClientType,
  WalletId,
  SendWalletActionMethod,
} from '../../types';

interface SendWalletAction {
  connector?: WalletConnectClientType;
  data: SendWalletActionMethod;
  setState: WCSSetState;
  walletAppId?: WalletId;
}

export const sendWalletAction = async ({
                                connector,
                                setState,
                                walletAppId,
                                data,
                              }: SendWalletAction): Promise<BroadcastResult> => {
  let valid = false;
  const {
    description = 'Send Wallet Action',
    method = PROVENANCE_METHODS.action,
    action,
    payload,
  } = data;
  const metadata = JSON.stringify({
    description,
    action,
    payload,
  });
  // Custom Request
  const request = {
    id: rngNum(),
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };
  if (!connector) return { valid, data, request, error: 'No wallet connected' };

  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletAppId);

  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT };
      knownWalletApp.eventAction(eventData);
    }

    console.dir(request);
    // send message
    const result = (await connector.sendCustomRequest(request));

    console.dir(result);

    // TODO what to do with Action response? Is it state altering or is that
    // to be handled by a session update?

    // TODO Update _thing_ within the wcjs state
    //setState({ signedJWT });
    return {
      valid,
      result,
      data,
      request,
    };
  } catch (error) {
    return { valid, error: `${error}`, data, request };
  }
};
