import { createConnector, type ConnectOptions } from './createConnector';

// This connect method has three parts:
// Creating a new connector w/connector.on() events (connect, session_update, and disconnect)
// Update the walletConnectService state with the newly created connector
// If we're not already connected, start a new session (Triggers a connect modal popup)
export const connect = ({
  bridge,
  broadcast,
  getState,
  jwtExpiration,
  noPopup,
  prohibitGroups,
  requiredIndividualAddress,
  requiredGroupAddress,
  resetState,
  setState,
  startConnectionTimer,
  state,
  updateModal,
  onQRCodeSet,
}: ConnectOptions) => {
  // Create a new walletconnect connector class and set up all walletconnect event listeners for it
  const newConnector = createConnector({
    bridge,
    broadcast,
    getState,
    jwtExpiration,
    noPopup,
    prohibitGroups,
    requiredIndividualAddress,
    requiredGroupAddress,
    resetState,
    setState,
    state,
    startConnectionTimer,
    updateModal,
    onQRCodeSet,
  });

  // If we're not connected, initiate a connection to this newConnector and dApp
  if (!newConnector.connected) {
    newConnector.createSession();
  }

  return newConnector;
};
