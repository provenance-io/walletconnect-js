import { convertUtf8ToHex } from '@walletconnect/utils';
import { MsgActivateRequest } from '@provenanceio/wallet-utils/esm/proto/provenance/marker/v1/tx_pb';
import * as GoogleProtobufAnyPb from 'google-protobuf/google/protobuf/any_pb';
import { MarkerData } from '../../types';
import { State } from '../walletConnectService';
import { WALLET_LIST, WALLET_APP_EVENTS } from '../../consts';

export const markerActivate = async (state: State, data: MarkerData) => {
  let valid = false;
  const { connector, address, walletApp, customExtId } = state;
  const { denom, gasPrice } = data;
  const method = 'provenance_sendTransaction';
  const description = 'Activate Marker';
  const protoMessage = 'provenance.marker.v1.MsgActivateRequest';
  const metadata = JSON.stringify({
    description,
    address,
    gasPrice,
    date: Date.now(),
  });
  // Custom Request
  const request = {
    id: 1,
    jsonrpc: '2.0',
    method,
    params: [metadata],
  };

  // Check for a known wallet app with special callback functions
  const knownWalletApp = WALLET_LIST.find(wallet => wallet.id === walletApp);
  if (!connector) return { valid, data, request, error: 'No wallet connected' };

  const msgActivateRequest = new MsgActivateRequest();
  msgActivateRequest.setDenom(denom);
  msgActivateRequest.setAdministrator(address);

  /* Convert the add marker message to any bytes for signing */
  const msgAny = new GoogleProtobufAnyPb.Any();
  msgAny.pack(msgActivateRequest.serializeBinary(), protoMessage, '/');
  const binary = String.fromCharCode(...msgAny.serializeBinary());
  const message = window.btoa(binary);

  // encode message (hex)
  const hexMsg = convertUtf8ToHex(message);
  request.params.push(hexMsg);
  try {
    // If the wallet app has an eventAction (web/extension) trigger it
    if (knownWalletApp && knownWalletApp.eventAction) {
      const eventData = { event: WALLET_APP_EVENTS.EVENT , customExtId };
      knownWalletApp.eventAction(eventData);
    }
    // send message
    const result = await connector.sendCustomRequest(request);
    // TODO verify transaction ID
    valid = !!result;
    // result is a hex encoded signature
    return { valid, result, data, request };
  } catch (error) {
    return { valid, error, data, request };
  }
};
