import WalletConnectClient from '@walletconnect/client';
import { CONNECTOR_EVENTS } from '../../../../consts';
import {
  ConnectData,
  ConnectMethodResults,
  WalletConnectEventDisconnect,
  WalletConnectInitMethod,
} from '../../../../types';
import { QRCodeModal } from './QrCodeModal';
import { createQRImage } from './createQRImage';
import { connectEvent, sessionUpdateEvent } from './events';

export const mobileConnect = async ({
  individualAddress,
  timeout,
  groupAddress,
  bridge,
  jwtExpiration,
  prohibitGroups,
  walletAppId,
}: WalletConnectInitMethod): Promise<ConnectMethodResults> =>
  new Promise((resolve, reject) => {
    // New connector we will be resolving this promise with
    let newConnector: undefined | WalletConnectClient = undefined;
    // Send the URI data directly to a specific wallet (instead of opening the qrCodeModal popup)
    // Create a new QRCodeModal class instance for the WalletConnectClient with requested connection params
    const WcQrCodeModal = new QRCodeModal({
      timeout,
      jwtExpiration,
      prohibitGroups,
      requiredGroupAddress: groupAddress,
      requiredIndividualAddress: individualAddress,
      onOpenCallback: async (dataUrl: string) => {
        const qrCodeImage = await createQRImage(dataUrl);
        // TODO: How do we inform wcjs that the modal should be opened here?
        // updateModal({
        //   QRCodeImg: qrCodeImage,
        //   QRCodeUrl: dataUrl,
        //   showModal: !walletAppId, // Don't trigger a QRCodeModal popup if they say "noPopup" or pass a specific walletId
        //   walletAppId,
        // });
        // If we need to open a wallet directly, we won't be opening the QRCodeModal and will instead trigger that wallet directly
        // if (walletAppId) openDirectWallet(walletAppId, dataUrl, updateModal);
      },
      onCloseCallback: () => {
        // TODO: How do we inform wcjs that the modal should be closed here?
        // updateModal({ showModal: false });
      },
    });
    // Create new connector
    newConnector = new WalletConnectClient({
      bridge,
      qrcodeModal: WcQrCodeModal,
    });

    // Create all of the newConnector events
    newConnector.on(CONNECTOR_EVENTS.connect, (error, payload: ConnectData) => {
      if (error) throw error;
      connectEvent({
        payload,
      });
    });
    newConnector.on(
      CONNECTOR_EVENTS.disconnect,
      (error, payload: WalletConnectEventDisconnect) => {
        if (error) throw error;
        // Resolve with state.resetState = true
      }
    );
    newConnector.on(
      CONNECTOR_EVENTS.wc_sessionUpdate,
      (error, payload: ConnectData) => {
        if (error) throw error;
        sessionUpdateEvent({
          payload,
        });
      }
    );
    // The session had already previously existed, trigger the existing connection event
    if (newConnector.connected) resolve({ connector: newConnector });

    // If we're not connected, initiate a connection to this newConnector and dApp
    if (newConnector && !newConnector.connected) {
      newConnector.createSession();
    }
    // Note: set timeouts will still get ran after a resolve, it's just that a reject won't have any effect
    // If this takes more than 3s just fail it
    setTimeout(() => {
      reject(null);
    }, 3000);

    resolve({ connector: newConnector });
  });
