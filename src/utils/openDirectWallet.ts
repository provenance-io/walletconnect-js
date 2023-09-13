// import { WALLET_APP_EVENTS, WALLET_LIST } from '../consts';
// import { UpdateModalData, WalletId } from '../types';

export const openDirectWallet = () =>
  // targetWalletId: WalletId,
  // uriData: string,
  // updateModal: (data: UpdateModalData) => void
  {
    // Find the target wallet based on id
    // const targetWallet = WALLET_LIST.find(
    //   ({ id: walletId }) => walletId === targetWalletId
    // );
    // if (targetWallet) {
    //   // Send event to target wallet
    //   const runEventAction = () => {
    //     if (targetWallet.eventAction) {
    //       // Build eventdata to send to the extension
    //       const eventData = {
    //         uri: uriData,
    //         event: WALLET_APP_EVENTS.INIT,
    //         redirectUrl: window.location.href,
    //       };
    //       // Trigger the event action based on the wallet
    //       targetWallet.eventAction(eventData);
    //     }
    //   };
    //   // Do we need to build dynamic links for this wallet (typically mobile wallets in responsive mode)
    //   if (targetWallet.generateUrl) {
    //     const dynamicUrl = targetWallet.generateUrl(uriData);
    //     // Save the new dynamicUrl into the modal state
    //     updateModal({ dynamicUrl });
    //   }
    //   // Wallet includes a self-existence check function
    //   if (targetWallet.walletCheck) {
    //     // Use function to see if wallet exists
    //     const walletExists = targetWallet.walletCheck();
    //     // Wallet exists, run the proper event action
    //     if (walletExists) runEventAction();
    //     // Wallet doesn't exist, send the user to the wallets download url (if provided)
    //     else if (targetWallet.walletUrl) {
    //       // TODO: This needs to open a menu to pick Chrome vs Firefox vs Brave (vs others when added)
    //       // Note: We can't sniff the browser out to auto redirect to the proper app store, so let the user pick
    //       window.open(targetWallet.walletUrl);
    //     }
    //   } else {
    //     // No self-existence check required, just run the event action for this wallet
    //     runEventAction();
    //   }
    // }
  };
