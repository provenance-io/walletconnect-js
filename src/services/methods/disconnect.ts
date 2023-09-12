import { BROWSER_WALLET_APP_EVENTS, WALLET_LIST } from '../../consts';

export const disconnect = () => {
  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find((wallet) => wallet.id === walletId);

  // If the wallet app has an eventAction (web/extension) trigger it
  if (knownWalletApp && knownWalletApp.eventAction) {
    const eventData = { event: BROWSER_WALLET_APP_EVENTS.EVENT, request };
    if (knownWalletApp.id === 'figure_extension') {
      console.log('wcjs | signHexMessage.ts | eventAction wait');
      result = await knownWalletApp.eventAction(eventData);
      console.log('wcjs | signHexMessage.ts | eventAction result: ', result);
    } else {
      knownWalletApp.eventAction(eventData);
    }
  }
};
