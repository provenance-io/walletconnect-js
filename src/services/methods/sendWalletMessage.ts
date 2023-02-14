import { WALLET_LIST, WALLET_APP_EVENTS, PROVENANCE_METHODS } from '../../consts';
import { rngNum } from '../../utils';
import type {
  BroadcastResult,
  WCSSetState,
  WalletConnectClientType,
  WalletId,
  SendWalletMessageMethod,
} from '../../types';

interface SendWalletMessage {
  connector?: WalletConnectClientType;
  data: SendWalletMessageMethod;
  setState: WCSSetState;
  walletAppId?: WalletId;
}

export const sendWalletMessage = async ({
                                connector,
                                setState,
                                walletAppId,
                                data,
                              }: SendWalletMessage): Promise<BroadcastResult> => {
  let valid = false;
  const {
    description = 'Send Wallet Message',
    method = PROVENANCE_METHODS.message,
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

    // Update _thing_ within the wcjs state
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
