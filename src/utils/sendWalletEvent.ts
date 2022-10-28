import { WALLET_LIST } from '../consts';
import { WalletId, EventValue, CustomEventData } from '../types';

export const sendWalletEvent = (
  targetId: WalletId,
  event: EventValue,
  data?: CustomEventData
) => {
  // Check for a known wallet app with special callback functions
  const targetWallet = WALLET_LIST.find((wallet) => wallet.id === targetId);
  // If the wallet app exists and has an eventAction (web/extension)
  if (targetWallet && targetWallet.eventAction) {
    const eventData = { event, data };
    targetWallet.eventAction(eventData);
  }
};
