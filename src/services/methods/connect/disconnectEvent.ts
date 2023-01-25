import { WALLET_LIST, WALLET_APP_EVENTS, WINDOW_MESSAGES } from '../../../consts';
import type { Broadcast, WCSState } from '../../../types';
import { clearLocalStorage } from '../../../utils';

interface Props {
  getState: () => WCSState;
  broadcast: Broadcast;
  resetState: () => void;
}

export const disconnectEvent = ({ getState, resetState, broadcast }: Props) => {
  // Get the latest state values
  const latestState = getState();
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find(
    (wallet) => wallet.id === latestState.walletApp
  );
  // If the wallet app has an eventAction (web/extension) trigger it
  if (knownWalletApp && knownWalletApp.eventAction) {
    const eventData = { event: WALLET_APP_EVENTS.DISCONNECT };
    knownWalletApp.eventAction(eventData);
  }
  resetState();
  broadcast(WINDOW_MESSAGES.DISCONNECT);
  // Manually clear out all of walletconnect-js from localStorage
  clearLocalStorage('walletconnect-js');
  // TEST: Testing a return of the broadcast data
  return '';
};
