import {
  WalletConnectService,
  WINDOW_MESSAGES,
  WALLET_LIST,
} from '@provenanceio/walletconnect-js/lib/service';
import { Element, ListElement } from './helpers';

require('./main.css');

const ModalContainerElement = document.getElementById('modalContainer');
const QRContainerElement = document.getElementById('qrcode');
const StatusElement = document.getElementById('statusValue');
const ConnectionInfoElement = document.getElementById('connectionInfo');
const walletConnectService = new WalletConnectService();

const walletHasDisconnectedEvent = () => {
  // Hide connection info and QR Code
  ConnectionInfoElement.classList.add('hidden');
  QRContainerElement.classList.add('hidden');
  // Remove disconnect button
  document.getElementById('disconnect').remove();
  // Update status element
  StatusElement.innerHTML = 'Not Connected';
  // Show the QR image and desktop wallet section
  document.getElementById('options').classList.remove('hidden');
  // Reload the page (need new QR code connection data)
  window.location.reload();
};

const walletConnectDisconnect = async () => {
  await walletConnectService.disconnect();
};

const walletConnectedUpdates = (data) => {
  // Remove the QR image and desktop wallet section
  document.getElementById('options').classList.add('hidden');
  // Pull data from connected state
  const { address, publicKey, connectionEXP, bridge, walletInfo, walletAppId } =
    walletConnectService.state;
  // Update status element
  StatusElement.innerHTML = `${
    data ? 'New Connection Established' : 'Existing Connection Established'
  }`;
  // Build list object to display about connection values
  console.log('walletConnectService.state: ', walletConnectService.state);
  const list = {
    address,
    publicKey,
    'Connection Expires': new Date(connectionEXP * 1000),
    bridge,
    'Wallet App': walletAppId || 'N/A',
    'Active Wallet Name': walletInfo?.name,
  };
  // Add list section to container
  ConnectionInfoElement.appendChild(ListElement(list));
  // Remove hidden class from connection info
  ConnectionInfoElement.classList.remove('hidden');
  // Create disconnect button
  ModalContainerElement.appendChild(
    Element({
      type: 'button',
      content: 'Disconnect',
      className: 'disconnect',
      id: 'disconnect',
      onClick: walletConnectDisconnect,
    })
  );
};

const createEventListeners = () => {
  walletConnectService.addListener(WINDOW_MESSAGES.CONNECTED, (data) => {
    walletConnectedUpdates(data);
  });
  walletConnectService.addListener(WINDOW_MESSAGES.DISCONNECT, () => {
    walletHasDisconnectedEvent();
  });
};

const checkExistingConnection = async () => {
  const { status } = walletConnectService.state;
  if (status === 'pending') {
    await walletConnectService.connect();
    walletConnectedUpdates();
  }
};

const renderWalletList = () => {
  const WalletContainerElement = document.getElementById('wallets');
  WALLET_LIST.forEach(({ type, id, title, eventAction }) => {
    if (type === 'extension' || type === 'web') {
      const handleWalletClick = () => {
        // If the wallet has an eventAction (they should all have an event action...)
        if (eventAction) {
          // Set the name of the wallet into the walletconnect-js state (to use as a reference)
          walletConnectService.setWalletAppId(id);
          // Build eventdata to send to the extension
          const eventData = {
            uri: encodeURIComponent(walletConnectService.state.modal.QRCodeUrl),
            event: 'walletconnect_init',
          };
          // Trigger the event action based on the wallet
          eventAction(eventData);
        }
      };
      WalletContainerElement.appendChild(
        Element({
          type: 'div',
          content: title,
          id,
          onClick: handleWalletClick,
          className: 'wallet',
        })
      );
    }
  });
};

const createQRCode = async () => {
  const { connected } = walletConnectService.state;
  // Only create the QR code if we're not connected already (page reload while connected)
  if (!connected) {
    await walletConnectService.connect();
    const QRCodeImage = walletConnectService.state.QRCode;
    const QRCodeElement = Element({
      type: 'img',
      src: QRCodeImage,
      alt: 'WalletConnect QR Code',
    });
    QRContainerElement.appendChild(QRCodeElement);
    QRContainerElement.classList.remove('hidden');
  }
};

const init = () => {
  checkExistingConnection();
  createQRCode();
  renderWalletList();
  createEventListeners();
};

init();
